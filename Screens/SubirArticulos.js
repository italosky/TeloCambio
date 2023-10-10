import React, { useEffect, useState } from "react";
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  FlatList
} from "react-native";
import { Card } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { auth, db, storage } from "../firebaseConfig";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { Picker } from "@react-native-picker/picker";

export default function SubirArticulos() {
  const navigation = useNavigation();
  const [selectedImages, setSelectedImages] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemCondition, setItemCondition] = useState("");
  const [itemTrade, setItemTrade] = useState("");
  const [itemRegion, setItemRegion] = useState([]);
  const [itemComuna, setItemComuna] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [userId, setUserId] = useState("");

  const [isEnabled, setIsEnabled] = useState(false);


  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permiso necesario para acceder a la cámara y a la galería.');
      }
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        setUserId(uid);
      }
    })();
  }, []);

  const pickImage = async () => {
    if (selectedImages.length < 3) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImages([...selectedImages, result.uri]);
      }
    } else {
      alert('Ya has seleccionado el número máximo de imágenes (3).');
    }
  };

  

  const SubirArticulo = async () => {
    try {
      if (
        !selectedImages ||
        !itemName ||
        !itemCondition ||
        !itemRegion ||
        !itemComuna ||
        !itemTrade ||
        !userId
      ) {
        alert("Todos los campos son obligatorios y debes estar autenticado");
        return;
      }
      const uploadUri = selectedImages;
      let filename = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);
      const extension = filename.split(".").pop();
      const name = filename.split(".").slice(0, -1).join(".");
      filename = name + Date.now() + "." + extension;
      const response = await fetch(uploadUri);
      const blob = await response.blob();
      const storageRef = ref(storage, `Imagenes de Articulos/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);
      setUploading(true);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (
            (snapshot.bytesTransferred / snapshot.totalBytes) *
            100
          ).toFixed(1);
          setProgress(progress);
        },
        (error) => {
          setUploading(false);
          alert("Error al subir archivo: " + error.message);
        },
        async () => {
          setUploading(false);
          try {
            const normalizedNombre ='('+itemName+')'.toLowerCase().replace(/\s+/g, '');
            const readableID = `${normalizedNombre}-${userId}`;
            const imageURL = await getDownloadURL(uploadTask.snapshot.ref);
            const itemDoc = doc(db, 'Publicaciones', readableID);
            await setDoc(itemDoc, {
              nombreArticulo: itemName,
              estadoArticulo: itemCondition,
              region: itemRegion,
              comuna: itemComuna,
              tipo: itemTrade,
              imagenURL: imageURL,
              userId: userId,
            });
            Alert.alert(
              "¡Felicitaciones!",
              "Publicación subida con éxito.",
              [{ text: "OK", onPress: () => navigation.navigate("Galeria2") }],
              { cancelable: false }
            );
          } catch (error) {
            alert("Error: " + error.message);
          }
        }
      );
    } catch (error) {
      console.error(error);
      alert("Error al subir el artículo. Por favor intenta de nuevo.");
    }
  };

  useEffect(() => {
    if (itemRegion) {
      fetch(`http://70.37.82.88:8020/api/communes?region=${itemRegion}`)
        .then((response) => response.json())
        .then((data) => {
            setItemComuna(data.communes);
        })
        .catch((error) => {
          console.error("Error al obtener las comunas:", error);
        });
    }
  }, [itemRegion]);

  return (
    
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <Card>
          {selectedImages && selectedImages.length > 3 && <Image source={{ uri: selectedImages[0] }} style={styles.image} />}
        </Card>
          
        <TouchableOpacity style={styles.cajaBoton} onPress={pickImage}>
          <Text style={styles.textoBoton}>Seleccionar Imagen</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.cajaTexto}>
        <TextInput
          maxLength={30}
          placeholder="Nombre del Artículo (Ej. Bicicleta)"
          style={styles.textInput}
          onChangeText={setItemName}
          value={itemName}
        />
      </View>

      <View style={styles.cajaTexto}>
        <Picker
          selectedValue={itemRegion}
          onValueChange={(itemValue) => setItemRegion(itemValue)}
          >
          <Picker.Item label="Seleccionar Región" value=""  enabled={isEnabled}/>
          <Picker.Item label="Región de Arica y Parinacota" value="Región de Arica y Parinacota" />
          <Picker.Item label="Región de Tarapacá" value="Región de Tarapacá" />
          <Picker.Item label="Región de Antofagasta" value="Región de Antofagasta" />
          <Picker.Item label="Región de Atacama" value="Región de Atacama" />
          <Picker.Item label="Región de Coquimbo" value="Región de Coquimbo" />
          <Picker.Item label="Región de Valparaíso" value="Región de Valparaíso" />
          <Picker.Item label="Región Metropolitana" value="Región Metropolitana" />
          <Picker.Item label="Región del Libertador General Bernardo O'Higgins" value="Región del Libertador General Bernardo O'Higgins" />
          <Picker.Item label="Región del Maule" value="Región del Maule" />
          <Picker.Item label="Región de Ñuble" value="Región de Ñuble" />
          <Picker.Item label="Región del Biobío" value="Región del Biobío" />
          <Picker.Item label="Región de La Araucanía" value="Región de La Araucanía" />
          <Picker.Item label="Región de Los Ríos" value="Región de Los Ríos" />
          <Picker.Item label="Región de Los Lagos" value="Región de Los Lagos" />
          <Picker.Item label="Región de Aysén del General Carlos Ibáñez del Campo" value="Región de Aysén del General Carlos Ibáñez del Campo" />
          <Picker.Item label="Región de Magallanes y de la Antártica Chilena" value="Región de Magallanes y de la Antártica Chilena" />
        </Picker>
      </View>

      <View style={styles.cajaTexto}>
        <Picker
          selectedValue={itemComuna.id}
          onValueChange={(itemValue) => setItemComuna(itemValue)}
        >
          <Picker.Item label="Seleccionar Comuna" value="" enabled={isEnabled}/>
          {itemComuna.map((comuna) => (
            <Picker.Item
              key={comuna.id}
              label={comuna.name}
              value={comuna.name}
            />
          ))}
        </Picker>
      </View>
        
      <View style={styles.cajaTexto}>
        <Picker
          selectedValue={itemCondition}
          onValueChange={(itemValue) => setItemCondition(itemValue)}
        >
          <Picker.Item label="Estado del Artículo" value="" enabled={isEnabled}/>
          <Picker.Item label="Usado - Aceptable" value="Usado - Aceptable" />
          <Picker.Item label="Usado - Buen Estado" value="Usado - Buen Estado" />
          <Picker.Item label="Usado - Como Nuevo" value="Usado - Como Nuevo" />
          <Picker.Item label="Nuevo" value="Nuevo" />
        </Picker>
      </View>

      <View style={styles.cajaTexto}>
        <Picker
          selectedValue={itemTrade}
          onValueChange={(itemValue) => setItemTrade(itemValue)}
        >
          <Picker.Item label="Motivo de Publicación" value="" enabled={isEnabled}/>
          <Picker.Item label="Intercambio" value="Intercambio" />
          <Picker.Item label="Gratis" value="Gratis" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.cajaBotonP} onPress={SubirArticulo}>
        <Text style={styles.textoBotonP}>Publicar</Text>
      </TouchableOpacity>
      
      {uploading && (
        <Modal visible={uploading} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalInnerContainer}>
              <Text style={{ fontSize: 18 }}>Subiendo... {progress}%</Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  containerImage: {
    alignItems: "center",
    paddingVertical: 1,
  },
  cajaBoton: {
    backgroundColor: "#ffffff",
    borderRadius: 30,
    paddingVertical: 13,
    width: 270,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#8AAD34",
  },
  textoBoton: {
    textAlign: "center",
    color: "#8AAD34",
  },
  cajaTexto: {
      paddingVertical: 5,
      paddingHorizontal: 25,
      backgroundColor: "#cccccc50",
      borderRadius: 30,
      height: 45,
      width: 270,
      justifyContent: 'center',
      marginTop: 30,
  },
  textInput: {
    paddingHorizontal: 15,
    color: "#000000",
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    paddingVertical: 15,
    alignItems: "center",
    textAlign: "center",
    marginTop: 7,
  },
  cajaBotonP: {
    backgroundColor: "#8AAD34",
    borderRadius: 30,
    paddingVertical: 15,
    width: 150,
    marginTop: 35,
    alignItems: "center",
  },
  textoBotonP: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "500",
  },
  image: {
    width: 120,
    height: 120,
    paddingVertical: 15,
    paddingHorizontal: 15,
    margin: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  modalInnerContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
