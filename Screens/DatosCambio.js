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

export default function Registro() {
  const navigation = useNavigation();
  const backGaleria = () => {
    navigation.navigate("Galeria2");
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.tinyLogo}
        source={require("../assets/FotoPerfil.com.png")}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}>Nombre del pj</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Correodelpj@gmail.com</Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.text}>Numero del pj</Text>
      </View>
      <TouchableOpacity style={styles.cajaBotonP} onPress={backGaleria}>
        <Text style={styles.textoBotonP}>Volver a Galeria</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tinyLogo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  textContainer: {
    backgroundColor: "#8AAD34",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    width: 250,
    padding: 9,
    margin: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
    fontWeight: "400",
  },
  cajaBotonP: {
    backgroundColor: "#63A355",
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
});
