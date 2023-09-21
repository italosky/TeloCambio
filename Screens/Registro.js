import React, { Component, useState } from "react";
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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { appFirebase, auth } from "../firebaseConfig";
import { getFirestore, collection, doc, setDoc, getDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Picker } from "@react-native-picker/picker";

export default function Registro(props) {
    const [selectedRegion, setSelectedRegion] = useState("");
    const [data, setData] = useState({
      nombre: "",
      direccion: "",
      telefono: "",
      correo: "",
      username: "",
      password: "",
    });
    const isValidEmail = (email) => {
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      return regex.test(email);
    };
    const handleRegister = async () => {
      const trimmedEmail = data.correo.trim();
      if (!isValidEmail(trimmedEmail)) {
        Alert.alert("Error", "El email proporcionado no es válido.");
        return;
      }
      try {
        const response = await createUserWithEmailAndPassword(auth, trimmedEmail, data.password);
  
        if (response.user) {
          const db = getFirestore(appFirebase);
  
          const userDoc = doc(db, "usuarios", data.username);
          const userDocSnapshot = await getDoc(userDoc);
          if (userDocSnapshot.exists()) {
            Alert.alert('Error', 'El nombre de usuario ya existe. Por favor, elige otro.');
            return;
          }
  
          await setDoc(userDoc, {
            uid: response.user.uid,
            nombre: data.nombre,
            direccion: data.direccion,
            telefono: data.telefono,
            email: data.email,
            username: data.username,
          });
  
          Alert.alert('Registro exitoso!');
          props.navigation.navigate("Login");
        }
      } catch (error) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            Alert.alert("Error", "Este email ya está siendo usado por otra cuenta.");
            break;
          case 'auth/invalid-email':
            Alert.alert("Error", "Por favor, introduce un email válido.");
            break;
          case 'auth/weak-password':
            Alert.alert("Error", "La contraseña es demasiado corta. Debe tener al menos 6 caracteres.");
            break;
          default:
            Alert.alert("Error", "Ocurrió un error al registrar el usuario. Por favor, inténtalo de nuevo.");
            break;
        }
        console.error("Error al registrar el usuario:", error);
      }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.padre}
    >
      <View style={styles.padre}>
        <View style={styles.tarjeta}>
          <View style={styles.cajaTexto}>
            <TextInput
              placeholder="Nombre y Apellido"
              style={{ paddingHorizontal: 15 }}
            />
          </View>

          <View style={styles.cajaTexto}>
            <TextInput
              placeholder="Region"
              // cambiar por barra
              style={{ paddingHorizontal: 15 }}
            />
            <Picker
              selectedValue={selectedRegion}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedRegion(itemValue)
              }
            >
              <Picker.Item label="Selecciona una region" value="" />
              <Picker.Item label="I	Región de Tarapacá" value="1" />
              <Picker.Item label="II	Región de Antofagasta" value="2" />
              <Picker.Item label="III	Región de Atacama" value="3" />
              <Picker.Item label="IV	Región de Coquimbo" value="4" />
              <Picker.Item label="V	Región de Valparaíso" value="5" />
              <Picker.Item label="VI	Región de OHiggins" value="6" />
              <Picker.Item label="VII	Región del Maule" value="7" />
              <Picker.Item label="VIII	Región del Bio-bío" value="8" />
              <Picker.Item label="IX	Región de La Araucanía" value="9" />
              <Picker.Item label="X	Región de Los Lagos" value="10" />
              <Picker.Item label="XI	Región Aysén" value="11" />
              <Picker.Item label="XII	Región de Magallanes" value="12" />
              <Picker.Item label="R.M  Región Metropolitana de Santiago" value="RM" />
              <Picker.Item label="XIV	Región de Los Ríos" value="14" />
              <Picker.Item label="XV	Región de Arica y Parinacota" value="15" />
              <Picker.Item label="XVI	Región de Ñuble" value="16" />
            </Picker>
          </View>

          <View style={styles.cajaTexto}>
            <TextInput
              placeholder="Numero de Telefono"
              style={{ paddingHorizontal: 15 }}
            />
          </View>

          <View style={styles.cajaTexto}>
            <TextInput
              placeholder="Correo Electronico"
              style={{ paddingHorizontal: 15 }}
            />
          </View>

          <View style={styles.cajaTexto}>
            <TextInput
              placeholder="Nombre de Usuario"
              style={{ paddingHorizontal: 15 }}
            />
          </View>

          <View style={styles.cajaTexto}>
            <TextInput
              placeholder="Contraseña"
              style={{ paddingHorizontal: 15 }}
              secureTextEntry={true}
            />
          </View>

          <View style={styles.padreBoton}>
          <TouchableOpacity style={styles.cajaBoton} onPress={handleRegister}>
              <Text style={styles.textoBoton}>Registrarse</Text>
          </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  padre: {
    flex: 1,
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
});
