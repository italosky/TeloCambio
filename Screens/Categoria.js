import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TouchableHighlight } from "react-native-gesture-handler";

export default function Galeria() {
  const navigation = useNavigation();

  return (
    <Text>Hola</Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  containerGaleria: {
    alignItems: "center",
    paddingVertical: 15,
  },

  title: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "white",
    justifyContent: "center",
  },
});
