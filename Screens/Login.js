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
import { useNavigation } from "@react-navigation/native";
import { appFirebase, auth } from "../firebaseConfig";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login(props) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigation = useNavigation();
  const goRecuperarContraseña = () => {
    navigation.navigate("RecuperarContraseña");
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,
    });
  }, [navigation]);

  const logeo = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      await AsyncStorage.setItem("isLoggedIn", "true");
      props.navigation.navigate("Galeria");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "El Correo o la Contraseña son Incorrectos.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.padre}
    >
      <View style={styles.padre}>
        <View>
          <Image
            source={require("../assets/FotoPerfil.com.png")}
            style={styles.profile}
          />
        </View>
        <View style={styles.tarjeta}>
          <View style={styles.cajaTexto}>
            <TextInput
              placeholder="Correo Electronico"
              style={{ paddingHorizontal: 15 }}
              onChangeText={(text) => setEmail(text)}
            />
          </View>

          <View style={styles.cajaTexto}>
            <TextInput
              placeholder="Contraseña"
              style={{ paddingHorizontal: 15 }}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
            />
          </View>
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={goRecuperarContraseña}
          >
            <Text style={styles.olvideContraseña}>Olvidé mi contraseña</Text>
          </TouchableOpacity>

          <View style={styles.padreBoton}>
            <TouchableOpacity style={styles.cajaBoton} onPress={logeo}>
              <Text style={styles.textoBoton}>Iniciar Sesión</Text>
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
  olvideContraseña: {
    color: "#8AAD34",
    textAlign: "center",
    marginTop: 10,
  },
});
