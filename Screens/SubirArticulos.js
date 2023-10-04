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
  const [image, setImage] = useState(null);
  const [itemName, setItemName] = useState("");
  const [itemCondition, setItemCondition] = useState("Nuevo");
  const [itemTrade, setItemTrade] = useState("Intercambio");
  const [itemComuna, setItemComuna] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Se necesitan permisos para el uso de la cámara");
        }
      }
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        setUserId(uid);
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const SubirArticulo = async () => {
    try {
      if (
        !image ||
        !itemName ||
        !itemCondition ||
        !itemComuna ||
        !itemTrade ||
        !userId
      ) {
        alert("Todos los campos son obligatorios y debes estar autenticado");
        return;
      }
      const uploadUri = image;
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
            const imageURL = await getDownloadURL(uploadTask.snapshot.ref);
            const publicacionesRef = collection(db, "Publicaciones");
            const articulosPublicadosDocRef = doc(
              publicacionesRef,
              "ArticulosPublicados"
            );
            const userCollectionRef = collection(
              articulosPublicadosDocRef,
              userId
            );
            await addDoc(userCollectionRef, {
              nombreArticulo: itemName,
              estadoArticulo: itemCondition,
              comuna: itemComuna,
              tipo: itemTrade,
              imagenURL: imageURL,
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {uploading && (
        <Modal visible={uploading} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalInnerContainer}>
              <Text style={{ fontSize: 18 }}>Subiendo... {progress}%</Text>
            </View>
          </View>
        </Modal>
      )}
      <View style={styles.containerImage}>
        <Card>
          {image && <Image source={{ uri: image }} style={styles.image} />}
        </Card>

        <TouchableOpacity style={styles.cajaBoton} onPress={pickImage}>
          <Text style={styles.textoBoton}>Seleccionar Imagen</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.containerTextInput}>
        <Text style={styles.title}>Nombre del Artículo</Text>
        <View style={styles.cajaTexto}>
          <TextInput
            maxLength={30}
            placeholder="Ej. Bicicleta"
            style={styles.textInput}
            onChangeText={setItemName}
            value={itemName}
          />
        </View>
        <Text style={styles.title}>Comuna</Text>
        <View style={styles.cajaTexto}>
          <TextInput
            placeholder="Ej: Las Condes"
            style={styles.textInput}
            onChangeText={setItemComuna}
            value={itemComuna}
          />
        </View>

        <View style={styles.cajaPicker}>
          <Picker
            selectedValue={itemCondition}
            onValueChange={(itemValue) => setItemCondition(itemValue)}
          >
            <Picker.Item label="Estado del artículo" value="a" />
            <Picker.Item label="Nuevo" value="Nuevo" />
            <Picker.Item label="Usado" value="Usado" />
          </Picker>
        </View>
        <View style={styles.cajaPicker}>
          <Picker
            selectedValue={itemTrade}
            onValueChange={(itemValue) => setItemTrade(itemValue)}
          >
            <Picker.Item
              label="Intercambio o Gratis"
              value="Articulo para intercambio o Gratis"
            />
            <Picker.Item label="Intercambio" value="Intercambio" />
            <Picker.Item label="Gratis" value="Gratis" />
          </Picker>
        </View>
        <TouchableOpacity style={styles.cajaBotonP} onPress={SubirArticulo}>
          <Text style={styles.textoBotonP}>Publicar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
  },
  containerImage: {
    alignItems: "center",
  },
  containerTextInput: {
    marginTop: 15,
    alignItems: "center",
    paddingVertical: 20,
  },
  cajaBoton: {
    backgroundColor: "#ffffff",
    borderRadius: 30,
    paddingVertical: 15,
    width: 250,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#8AAD34",
  },
  textoBoton: {
    textAlign: "center",
    color: "#8AAD34",
  },
  cajaTexto: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: "#cccccc50",
    borderRadius: 30,
    marginVertical: 7,
    width: 250,
  },
  cajaPicker: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: "#cccccc50",
    borderRadius: 30,
    marginVertical: 7,
    width: 295,
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
  },
  cajaBotonP: {
    backgroundColor: "#8AAD34",
    borderRadius: 30,
    paddingVertical: 15,
    width: 150,
    marginTop: 30,
    alignItems: "center",
  },
  textoBotonP: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "500",
  },
  image: {
    width: 150,
    height: 150,
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
    width: "80%", // O el porcentaje o ancho fijo que desees.
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
