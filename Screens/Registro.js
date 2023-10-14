import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";
import { updateDoc } from "firebase/firestore";
import { Card } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Registro(props) {
  const [data, setData] = useState({
    nombre_apellido: "",
    telefono: "",
    email: "",
    password: "",
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const validateEmailDetails = (email) => {
    const [localPart, domainPart] = email.split("@");
    if (!domainPart || !localPart) {
      return "El correo electrónico debe contener un '@'.";
    }
    const domainParts = domainPart.split(".");
    if (domainParts.some((part) => part.length === 0)) {
      return "La parte de dominio no debe tener puntos consecutivos o empezar/terminar con un punto.";
    }
    if (!domainPart.includes(".")) {
      return "La parte de dominio debe contener un punto ('.').";
    }
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regex.test(email)) {
      return "El correo electrónico contiene caracteres no permitidos.";
    }
    return null;
  };

  const isValidPhoneNumber = (telefono) => {
    const regex = /^[0-9]{0,12}$/;
    return regex.test(telefono);
  };

  const handleRegister = async () => {
    let errorMessage = null;
    if (
      !data.password ||
      !data.email ||
      !data.nombre_apellido ||
      !data.telefono
    ) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }
    if (!hasSelectedImage) {
      Alert.alert(
        "Error",
        "Selecciona una foto de perfil antes de registrarte."
      );
      return;
    }
    const trimmedEmail = data.email.trim();
    const emailValidationMessage = validateEmailDetails(trimmedEmail);
    if (emailValidationMessage !== null) {
      errorMessage = emailValidationMessage;
    }
    if (!isValidPhoneNumber(data.telefono)) {
      errorMessage = "El número de teléfono no es válido.";
    }
    if (errorMessage) {
      Alert.alert("Error", errorMessage);
      return;
    }

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        data.password
      );
      if (response.user) {
        const userUID = response.user.uid;
        const normalizedNombre = data.nombre_apellido
          .toLowerCase()
          .replace(/\s+/g, "");
        const readableID = `${normalizedNombre}-${userUID}`;
        const userDoc = doc(db, "Usuarios", readableID);
        await setDoc(userDoc, {
          uid: userUID,
          nombre_apellido: data.nombre_apellido,
          telefono: data.telefono,
          email: data.email,
        });

        if (selectedImages.length > 0) {
          setUploading(true);
          const urls = await Promise.all(
            selectedImages.map(async (imageUri, index) => {
              const response = await fetch(imageUri);
              const blob = await response.blob();
              const filename = `imagen${index + 1}-${Date.now()}`;
              const storageRef = ref(storage, `Perfil/${filename}`);
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
          await updateDoc(userDoc, { imagenen: urls });

          setUploading(false);
        }

        Alert.alert("Registro exitoso!");
        props.navigation.navigate("Login");
      }
    } catch (error) {
      errorMessage = "Error al registrar.";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email ya en uso.";
          break;
        case "auth/invalid-email":
          errorMessage = "Email inválido.";
          break;
        case "auth/weak-password":
          errorMessage = "Contraseña muy corta.";
          break;
        default:
          break;
      }
      Alert.alert("Error", errorMessage);
    }
  };

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

    if (!result.cancelled) {
      setSelectedImages([result.assets[0].uri]);
      setHasSelectedImage(true);
    }
  };

  const removeImage = (indexToRemove) => {
    setSelectedImages(
      selectedImages.filter((_, index) => index !== indexToRemove)
    );
  };
  const [hasSelectedImage, setHasSelectedImage] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "position" : "height"}
        style={styles.padre}
      >
        <View style={styles.padre}>
          <View style={styles.tarjeta}>
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
              <TouchableOpacity style={styles.cajaBotonimg} onPress={pickImage}>
                <Text style={styles.textoBotonimg}>
                  Seleccionar Foto de Perfil
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cajaTexto}>
              <TextInput
                placeholder="Nombre y Apellido"
                style={{ paddingHorizontal: 15 }}
                onChangeText={(text) =>
                  setData({ ...data, nombre_apellido: text })
                }
                value={data.nombre_apellido}
              />
            </View>

            <View style={styles.cajaTexto}>
              <TextInput
                placeholder="Número de Teléfono (+569-XXXXXXX)"
                keyboardType="numeric"
                style={{ paddingHorizontal: 15 }}
                onChangeText={(text) => setData({ ...data, telefono: text })}
                value={data.telefono}
              />
            </View>
            <View style={styles.cajaTexto}>
              <TextInput
                placeholder="Correo (telocambio@mail.cl)"
                style={{ paddingHorizontal: 15 }}
                onChangeText={(text) => setData({ ...data, email: text })}
                value={data.email}
              />
            </View>
            <View style={styles.cajaTexto}>
              <TextInput
                placeholder="Contraseña"
                style={{ paddingHorizontal: 15 }}
                secureTextEntry={true}
                onChangeText={(text) => setData({ ...data, password: text })}
                value={data.password}
              />
            </View>
            <View style={styles.padreBoton}>
              <TouchableOpacity
                style={styles.cajaBoton}
                onPress={handleRegister}
              >
                <Text style={styles.textoBoton}>Registrarse</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  image: {
    width: 120,
    height: 120,
    paddingVertical: 15,
    paddingHorizontal: 15,
    margin: 15,
  },
  imagesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 15,
  },

  imageWrapper: {
    position: "relative",
    margin: 3,
  },
  containerImage: {
    alignItems: "center",
    paddingVertical: 1,
  },
  padre: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  profile: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "white",
  },
  tarjeta: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: 340,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      with: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cajaTexto: {
    paddingVertical: 18,
    backgroundColor: "#cccccc50",
    borderRadius: 30,
    marginVertical: 7,
  },
  padreBoton: {
    alignItems: "center",
  },
  cajaBoton: {
    backgroundColor: "#8AAD34",
    borderRadius: 30,
    paddingVertical: 20,
    width: 150,
    marginTop: 20,
  },
  textoBoton: {
    textAlign: "center",
    color: "white",
  },
  cajaBotonimg: {
    backgroundColor: "#ffffff",
    borderRadius: 30,
    paddingVertical: 13,
    width: 270,
    borderWidth: 2,
    borderColor: "#8AAD34",
    marginVertical: 25,
  },
  textoBotonimg: {
    textAlign: "center",

    color: "#8AAD34",
  },
});
