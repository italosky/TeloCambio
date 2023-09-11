import React, { Component } from "react";
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

export default function Registro() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.padre}
    >
      <View style={styles.padre}>
        <View style={styles.tarjeta}>
          <View style={styles.cajaTexto}>
            <TextInput
              placeholder="Nombre"
              style={{ paddingHorizontal: 15 }}
              secureTextEntry={true}
            />
          </View>

          <View style={styles.cajaTexto}>
            <TextInput
              placeholder="Apellido"
              style={{ paddingHorizontal: 15 }}
              secureTextEntry={true}
            />
          </View>

          <View style={styles.cajaTexto}>
            <TextInput
              placeholder="Comuna"
              style={{ paddingHorizontal: 15 }}
              secureTextEntry={true}
            />
          </View>

          <View style={styles.cajaTexto}>
            <TextInput
              placeholder="Región"
              style={{ paddingHorizontal: 15 }}
              secureTextEntry={true}
            />
          </View>

          <View style={styles.cajaTexto}>
            <TextInput
              placeholder="Numero de Telefono"
              style={{ paddingHorizontal: 15 }}
              secureTextEntry={true}
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
              placeholder="Genero"
              style={{ paddingHorizontal: 15 }}
              secureTextEntry={true}
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
            <TouchableOpacity style={styles.cajaBoton}>
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
