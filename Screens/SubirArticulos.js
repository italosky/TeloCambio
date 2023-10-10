import React, { useEffect, useState } from "react";
import {
  Platform, StyleSheet, Text, TextInput,
  View, Image, TouchableOpacity, Alert,
  Modal, ScrollView
} from "react-native";
import { Card } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { auth, db, storage } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Picker } from "@react-native-picker/picker";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function SubirArticulos() {
  const navigation = useNavigation();
  const [images, setImages] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemCondition, setItemCondition] = useState("");
  const [itemTrade, setItemTrade] = useState("");
  const [itemComuna, setItemComuna] = useState("");
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState("");
  const [progress, setProgress] = useState(0);

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Se necesitan permisos para el uso de la cámara");
        }
      }
      const user = auth.currentUser;
      if (user) setUserId(user.uid);
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true, aspect: [4, 3], quality: 1,
    });
    if (!result.canceled) {
      images.length < 3 ? setImages([...images, result.assets[0].uri]) : alert('Debes seleccionar 3 imagenes');
    }
  };

  const SubirArticulo = async () => {
    try {
      if (images.length < 3) {
        Alert.alert("Atención!","Debes seleccionar 3 imágenes minimo");
        return;
      }
      if (!itemName || !itemCondition || !itemComuna || !itemTrade || !userId || images.length < 3) {
        Alert.alert("Todos los campos son obligatorios");
        return;
      }
      setUploading(true);
      const urls = await Promise.all(images.map(async (imageUri, index) => {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const filename = `imagen${index + 1}-${Date.now()}`;
        const storageRef = ref(storage, `Imagenes de Articulos/${filename}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);
        return new Promise((resolve, reject) => {
          uploadTask.on("state_changed", 
            snapshot => {
              setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            }, 
            error => reject(error), 
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });
      }));
      const [url1, url2, url3] = urls;
      const normalizedNombre ='('+itemName+')'.toLowerCase().replace(/\s+/g, '');
      const readableID = `${normalizedNombre}-${userId}`;
      const itemDoc = doc(db, 'Publicaciones', readableID);
      await setDoc(itemDoc, {
        nombreArticulo: itemName,
        estadoArticulo: itemCondition,
        comuna: itemComuna,
        tipo: itemTrade,
        imagenURL: url1,
        imagenURL2: url2,
        imagenURL3: url3,
        userId: userId,
      });
      setUploading(false);
      Alert.alert("¡Felicitaciones Telocambista!", "Publicación subida con éxito.", [{ text: "OK", onPress: () => navigation.navigate("Galeria2") }], { cancelable: false });
    } catch (error) {
      setUploading(false);
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
        <View style={styles.imagesContainer}>
        {images.map((image, index) => (
          <View style={styles.imageWrapper} key={index}>
            <Card style={styles.imageCard}>
              <Image source={{ uri: image }} style={styles.image} />
            </Card>
            <TouchableOpacity 
              style={styles.deleteIconContainer}
              onPress={() => removeImage(index)}>
              <View style={styles.circle}>
                <Icon name="trash" size={20} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        ))}
        </View>
        <TouchableOpacity style={styles.cajaBoton} onPress={pickImage}>
          <Text style={styles.textoBoton}>Seleccionar Imagen</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.containerTextInput}>
        <View style={styles.cajaTexto}>
          <TextInput
            maxLength={30}
            placeholder="Escriba el nombre del articulo"
            style={styles.textInput}
            onChangeText={setItemName}
            value={itemName}
          />
        </View>

        <View style={styles.cajaTexto}>
          <TextInput
            placeholder="Escriba la comuna de publicacion"
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
            <Picker.Item label="Estado del artículo" value="" />
            <Picker.Item label="Nuevo" value="Nuevo" />
            <Picker.Item label="Usado" value="Usado" />
          </Picker>
        </View>
        <View style={styles.cajaPicker}>
          <Picker
            selectedValue={itemTrade}
            onValueChange={(itemValue) => setItemTrade(itemValue)}
          >
            <Picker.Item label="Motivo de publicación" value=""/>
            <Picker.Item label="Intercambiar artículo" value="Intercambiar artículo" />
            <Picker.Item label="Regalar artículo" value="Regalar artículo" />
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
    marginVertical: 10,
    borderRadius: 30,
    width: 300,
  },
  cajaPicker: {
    paddingHorizontal: 25,
    backgroundColor: "#cccccc50",
    borderRadius: 30,
    marginVertical: 10,
    width: 300,
    height: 60,
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
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 15, 
  },
  image: {
    width: 100,
    height: 100,
    margin: 1,
  },  
  imageWrapper: {
    position: 'relative',
    margin: 3,
  },
  deleteIconContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  circle: {
    backgroundColor: 'rgba(255, 100, 100, 0.8)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
});
