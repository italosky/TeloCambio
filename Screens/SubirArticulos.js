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
  FlatList,
} from "react-native";
import { Card } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { auth, db, storage } from "../firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome";

export default function SubirArticulos() {
  const navigation = useNavigation();
  const [selectedImages, setSelectedImages] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemNameError, setItemNameError] = useState("");
  const [itemCondition, setItemCondition] = useState("");
  const [itemTrade, setItemTrade] = useState("");
  const [itemRegion, setItemRegion] = useState([]);
  const [selectedRegionUrl, setSelectedRegionUrl] = useState("");
  const [itemProvincia, setItemProvincia] = useState([]);
  const [selectedComuna, setSelectedComuna] = useState(null);
  const [itemComuna, setItemComuna] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState("");
  const [progress, setProgress] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState("");
  const removeImage = (indexToRemove) => {
    setSelectedImages(
      selectedImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permiso necesario para acceder a la cámara y a la galería.");
      }
      const user = auth.currentUser;
      if (user) setUserId(user.uid);
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result.canceled) {
      selectedImages.length < 3
        ? setSelectedImages([...selectedImages, result.assets[0].uri])
        : alert("Debes seleccionar 3 imagenes");
    }
  };

  const SubirArticulo = async () => {
    try {
      if (selectedImages.length < 3) {
        Alert.alert("Atención!", "Debes seleccionar 3 imágenes minimo");
        return;
      }
      if (
        !selectedComuna ||
        selectedImages.length < 3 ||
        !userId ||
        !itemName ||
        !itemCondition ||
        !itemTrade
      ) {
        Alert.alert("Todos los campos son obligatorios");
        return;
      }
      const comunaId = selectedComuna.id;
      setUploading(true);
      const urls = await Promise.all(
        selectedImages.map(async (imageUri, index) => {
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const filename = `imagen${index + 1}-${Date.now()}`;
          const storageRef = ref(storage, `Imagenes de Articulos/${filename}`);
          const uploadTask = uploadBytesResumable(storageRef, blob);
          return new Promise((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                setProgress(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
              },
              (error) => reject(error),
              async () => {
                const downloadURL = await getDownloadURL(
                  uploadTask.snapshot.ref
                );
                resolve(downloadURL);
              }
            );
          });
        })
      );
      const [url1, url2, url3] = urls;
      const normalizedNombre =
        "(" + itemName + ")".toLowerCase().replace(/\s+/g, "");
      const readableID = `${normalizedNombre}-${userId}`;
      const itemDoc = doc(db, "Publicaciones", readableID);
      await setDoc(itemDoc, {
        nombreArticulo: itemName,
        estadoArticulo: itemCondition,
        comuna: selectedComuna.name,
        region: selectedRegion.name,
        tipo: itemTrade,
        imagenURL: url1,
        imagenURL2: url2,
        imagenURL3: url3,
        uid: userId,
        fecha: serverTimestamp(),
        estadoPublicacion: "activa",
      });
      setUploading(false);
      Alert.alert(
        "¡Felicitaciones Telocambista!",
        "Publicación subida con éxito.",
        [{ text: "OK", onPress: () => navigation.navigate("Galeria2") }],
        { cancelable: false }
      );
    } catch (error) {
      setUploading(false);
      console.error(error);
      alert("Error al subir el artículo. Por favor intenta de nuevo.");
    }
  };

  useEffect(() => {
    // Obtener todas las regiones al cargar el componente
    fetch("http://70.37.82.88:8020/api/regions")
      .then((response) => response.json())
      .then((data) => {
        setItemRegion(data.regions);
      })
      .catch((error) => {
        console.error("Error al obtener las regiones:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedRegionUrl) {
      fetch(selectedRegionUrl)
        .then((response) => response.json())
        .then((data) => {
          setItemProvincia(data.provinces);
          setItemComuna(data.communes);
        })
        .catch((error) => {
          console.error("Error al obtener provincias y comunas:", error);
        });
    }
  }, [selectedRegionUrl]);

  const handleItemNameChange = (text) => {
    // Limitar la longitud del itemName a 30 caracteres
    if (text.length <= 17) {
      setItemName(text);
      setItemNameError("");
    } else {
      setItemNameError("El nombre del artículo no puede tener más de 20 caracteres");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <View style={styles.containerImage}>
          <View style={styles.imagesContainer}>
            {selectedImages.map((selectedImages, index) => (
              <View style={styles.imageWrapper} key={index}>
                <Card style={styles.imageCard}>
                  <Image
                    source={{ uri: selectedImages }}
                    style={styles.image}
                  />
                </Card>
                <TouchableOpacity
                  style={styles.deleteIconContainer}
                  onPress={() => removeImage(index)}
                >
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

        <View style={styles.cajaTexto}>
          <TextInput
            maxLength={30}
            placeholder="Nombre del Artículo (Ej. Bicicleta)"
            style={styles.textInput}
            onChangeText={handleItemNameChange}
            value={itemName}
          />
        </View>

        <View style={styles.cajaPicker}>
          <Picker
            selectedValue={selectedRegionUrl}
            onValueChange={(itemValue, itemIndex) => {
              const selectedRegionData = itemRegion.find(
                (region) => region.url === itemValue
              );
              setSelectedRegion(selectedRegionData);
              setSelectedRegionUrl(itemValue);
            }}
          >
            <Picker.Item
              label="Seleccionar Región"
              value=""
              enabled={isEnabled}
            />
            {itemRegion.map((region) => (
              <Picker.Item
                key={region.id}
                label={region.name}
                value={region.url}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.cajaPicker}>
          <Picker
            selectedValue={selectedComuna}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedComuna(itemValue)
            }
            enabled={selectedRegionUrl !== ""}
          >
            <Picker.Item
              label="Seleccionar Comuna"
              value=""
              enabled={isEnabled}
            />
            {itemComuna.map((comuna) => (
              <Picker.Item
                key={comuna.id}
                label={comuna.name}
                value={comuna} // Aquí debes pasar el objeto de la comuna
              />
            ))}
          </Picker>
        </View>

        <View style={styles.cajaPicker}>
          <Picker
            selectedValue={itemCondition}
            onValueChange={(itemValue) => setItemCondition(itemValue)}
          >
            <Picker.Item
              label="Estado del Artículo"
              value=""
              enabled={isEnabled}
            />
            <Picker.Item label="Usado" value="Usado" />
            <Picker.Item label="Nuevo" value="Nuevo" />
          </Picker>
        </View>

        <View style={styles.cajaPicker}>
          <Picker
            selectedValue={itemTrade}
            onValueChange={(itemValue) => setItemTrade(itemValue)}
          >
            <Picker.Item
              label="Motivo de Publicación"
              value=""
              enabled={isEnabled}
            />
            <Picker.Item
              label="Intercambiar artículo"
              value="Intercambiar artículo"
            />
            <Picker.Item label="Regalar artículo" value="Regalar artículo" />
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    width: 200,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#8AAD34",
  },
  textoBoton: {
    textAlign: "center",
    color: "#8AAD34",
    fontSize: 15,
    fontWeight: "500",
  },
  cajaTexto: {
    paddingVertical: 12,
    backgroundColor: "#cccccc50",
    borderRadius: 30,
    width: 300,
    marginTop: 30,
    marginVertical: 8,
  },
  cajaPicker: {
    backgroundColor: "#cccccc50",
    borderRadius: 30,
    marginVertical: 8,
    width: 300,
  },
  textInput: {
    paddingHorizontal: 15,
    color: "#000000",
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
  imagesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    margin: 1,
  },
  imageWrapper: {
    position: "relative",
    margin: 3,
  },
  deleteIconContainer: {
    position: "absolute",
    top: -5,
    right: -5,
  },
  circle: {
    backgroundColor: "rgba(255, 100, 100, 0.8)",
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },
});
