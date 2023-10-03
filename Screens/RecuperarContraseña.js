import React, { useState } from "react";
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

import { appFirebase } from "../firebaseConfig";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState("");
  const auth = getAuth(appFirebase);

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Éxito",
        "Se ha enviado un correo electrónico con instrucciones para restablecer la contraseña."
      );
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error al enviar el correo de recuperación:", error);
      Alert.alert(
        "Error",
        "No se pudo enviar el correo de recuperación. Verifique la dirección de correo electrónico."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.container}>
        <View>
          <Image
            source={require("../assets/LogoTeLoCambio.png")}
            style={styles.profile}
          />
        </View>
        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Correo Electrónico"
              style={styles.input}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleForgotPassword}
            >
              <Text style={styles.buttonText}>Restablecer Contraseña</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  profile: {
    width: 250,
    height: 120,
  },
  card: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: 340,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputContainer: {
    paddingVertical: 18,
    backgroundColor: "#cccccc50",
    borderRadius: 30,
    marginVertical: 7,
  },
  input: {
    paddingHorizontal: 15,
  },
  buttonContainer: {
    alignItems: "center",
  },
  button: {
    backgroundColor: "#8AAD34",
    borderRadius: 30,
    paddingVertical: 12,
    width: 150,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    textAlign: "center",
    color: "white",
  },
});
