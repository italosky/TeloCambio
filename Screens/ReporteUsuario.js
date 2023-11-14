import React, { Component, useState, useEffect } from "react";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { db } from "../firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";

export default function Registro(props) {
  const [userId, setUserId] = useState(null);
  const [data, setData] = useState({
    causa_reporte: "",
    reporte: "",
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        console.log(
          "El usuario no esta autenticado, porfavor dirijase a login"
        );
      }
    });
    return () => unsubscribe();
  }, []);

  const goGaleria2 = () => {
    navigation.navigate("Galeria2");
  };
  const navigation = useNavigation();
  const route = useRoute();
  const { nombreArticulo, imagenes, estadoArticulo, comuna } = route.params;
  const handleRegister = async () => {
    if (
      data.causa_reporte &&
      data.reporte &&
      nombreArticulo &&
      imagenes &&
      estadoArticulo &&
      comuna
    ) {
      try {
        const reportesUsuariosRef = collection(db, "Reportes");
        const newReporteRef = await addDoc(reportesUsuariosRef, {
          causa_reporte: data.causa_reporte,
          reporte: data.reporte,
          nombreArticulo,
          imagenes,
          estadoArticulo,
          comuna,
          timestamp: serverTimestamp(),

          // Agrega cualquier otro campo que desees almacenar en el reporte

          userid: userId,
        });
        Alert.alert(
          "¡Reporte enviado",
          "Un administrador revisará su solicitud",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Galeria2"),
            },
          ]
        );
        setData({
          causa_reporte: "",
          reporte: "",
        });

        // Puedes hacer algo más después de enviar el reporte si es necesario
      } catch (error) {
        console.error(error);
        Alert.alert("Error enviando el reporte.");
      }
    } else {
      Alert.alert("Por favor, completa todos los campos");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.padre}
    >
      <View style={styles.padre}>
        <View style={styles.tarjeta}>
          <View style={styles.cajaPicker}>
            <Picker
              selectedValue={data.causa_reporte}
              onValueChange={(itemValue) =>
                setData({ ...data, causa_reporte: itemValue })
              }
            >
              <Picker.Item label="Causa del reporte" value="" />
              <Picker.Item
                label="No responde al intercambio"
                value="No responde al intercambio"
              />
              <Picker.Item
                label="Las fotos son falsas o robadas"
                value="Las fotos son falsas o robadas"
              />
              <Picker.Item label="Estafa" value="Estafa" />
              <Picker.Item label="Otros" value="Otros" />
            </Picker>
          </View>
          <View style={styles.cajaTexto}>
            <TextInput
              placeholder="Escriba aquí si desea añadir mas detalles"
              style={{ paddingHorizontal: 15 }}
              onChangeText={(text) => setData({ ...data, reporte: text })}
              value={data.reporte}
              multiline={true}
              numberOfLines={5}
              maxLength={140}
            />
          </View>
          <View style={styles.padreBoton}>
            <TouchableOpacity
              style={styles.cajaBotonReportar}
              onPress={handleRegister}
            >
              <Text style={styles.textoBoton}>Confirmar Reporte</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cajaBotonCancelar}>
              <Text style={styles.textoBoton}>Cancelar</Text>
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
  tarjeta: {
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
  cajaPicker: {
    paddingVertical: 0,
    backgroundColor: "#cccccc50",
    borderRadius: 30,
    marginVertical: 10,
  },
  cajaTexto: {
    backgroundColor: "#cccccc50",
    borderRadius: 30,
    width: 300,
    height: 60,
  },
  padreBoton: {
    alignItems: "center",
  },
  cajaBotonCancelar: {
    backgroundColor: "#8AAD34",
    borderRadius: 30,
    paddingVertical: 12,
    marginTop: 10,
    width: 200,
  },
  cajaBotonReportar: {
    backgroundColor: "#cc0000",
    borderRadius: 30,
    paddingVertical: 12,
    marginTop: 10,
    width: 200,
  },
  textoBoton: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
});
