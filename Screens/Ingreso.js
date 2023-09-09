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


export default function Ingreso() {
  const navigation = useNavigation();

  React.useLayoutEffect(() => {

    navigation.setOptions({
      headerLeft: () => null, // Esto oculta el botón para devolverse
      gestureEnabled: false, // Esto deshabilita devolverse con el dedo
    });
  }, [navigation]);

  const goLogin = () => {
    navigation.navigate("Login");
  };
  const goRegistro = () => {
    navigation.navigate("Registro");
  };

  return (
    <View style={styles.padre}>
      <View style={styles.padreBoton}>
        <TouchableOpacity style={styles.cajaBotonL} onPress={goLogin}>
          <Text style={styles.textoBoton}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.padreBoton}>
        <TouchableOpacity style={styles.cajaBotonR} onPress={goRegistro}>
          <Text style={styles.textoBoton}>Registrarse</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.padreBoton}>
        <TouchableOpacity style={styles.cajaBotonG}>
          <Text style={styles.textoBoton}>BAYRON CAMBIALO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

}
//Estilos para los botones y texto
const styles = StyleSheet.create({
  padre: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  padreBoton: {
    alignItems: "center",
  },
  cajaBotonL: {
    backgroundColor: "#8AAD34",
    borderRadius: "30",
    paddingVertical: 25,
    width: 300,
    marginTop: 35,
  },
  cajaBotonR: {
    backgroundColor: "#8AAD34",
    borderRadius: "30",
    paddingVertical: 25,
    width: 300,
    marginTop: 35,
  },
  cajaBotonG: {
    backgroundColor: "#000",
    borderRadius: "30",
    paddingVertical: 25,
    width: 300,
    marginTop: 35,
  },
  textoBoton: {
    textAlign: "center",
    color: "white",
  },
});
