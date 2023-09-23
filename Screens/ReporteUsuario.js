import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker"; // Importa el Picker de @react-native-picker/picker

export default function Registro() {
  const [selectedMotivo, setSelectedMotivo] = useState(""); // esto mantiene la opcion seleccionada en el menu desplegable
  const navigation = useNavigation();
  const goPerfilOtros = () => {
    navigation.navigate("PerfilOtros");
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.padre}
    >
      <View style={styles.padre}>
        <View style={styles.tarjeta}>
          {/* el picker es el menu desplegable */}
          <Picker
            selectedValue={selectedMotivo}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedMotivo(itemValue)
            }
          >
            <Picker.Item label="Selecciona un motivo" value="" />
            <Picker.Item label="Fraude" value="Fraude" />
            <Picker.Item label="Engañoso" value="Engañoso" />
            <Picker.Item label="Otros" value="Otros" />
          </Picker>

          {/* Campo de texto para el detalle del reporte */}
          <TextInput
            placeholder="Detalle del Reporte (máximo 280 caracteres)"
            style={styles.cajaTexto}
            
            multiline
            maxLength={280}
          />

          {/* Contenedor de botones */}
          <View style={styles.contenedorBotones}>
            <TouchableOpacity
              style={styles.cajaBotonCancelar}
              onPress={() => navigation.navigate("PáginaAnterior")} // NO OLVIDAR Reemplaza "PáginaAnterior" con el nombre de la página a la que deseas navegar
            >
              <Text style={styles.textoBoton} onPress={goPerfilOtros}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cajaBoton}>
              <Text style={styles.textoBoton}>Enviar Reporte</Text>
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
    margin: 40,
    backgroundColor: "white",
    borderRadius: 20,
    width: 340,
    padding: 25,
    paddingVertical: 110,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cajaTexto: {
    backgroundColor: "#cccccc50",
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
    marginTop: 80,
  },
  contenedorBotones: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 80,
  },
  cajaBoton: {
    backgroundColor: "#FF0000",
    borderRadius: 30,
    paddingVertical: 20,
    width: 130,
  },
  cajaBotonCancelar: {
    backgroundColor: "#8AAD34",
    borderRadius: 30,
    paddingVertical: 20,
    width: 130,
  },
  textoBoton: {
    textAlign: "center",
    color: "white",
  },
});




