import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SliderBox } from 'react-native-image-slider-box';

export default function DetalleArticulo() {
  const navigation = useNavigation();
  
  const images = [
    require('./assets,articulos/Patines.png'),
    require('./assets,articulos/Destornilladores.png'),
    require('./assets,articulos/LucesBici.png'),
    require('./assets,articulos/Lentes.png'),
  ]

  const ReporteUsuario = () => {
    navigation.navigate("ReporteUsuario");
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerCarrusel}>
        <SliderBox 
          images={images}
          style={styles.carrusel} 
          dotColor="green" 
          inactiveDotColor="black"
          autoplay={true}
          firtsItem={1}
          />
      </View>
      <Text style={styles.text1}>Artículo</Text>
      <Text style={styles.text2}>• Usado</Text>
      <Text style={styles.text2}>• Intercambio</Text>
      <View>
        <Text style={styles.nombreUser}>Juanito Perez</Text>
        <Image source={require("../assets/FotoPerfil.com.png")} style={styles.imageUser}/>
      </View>
      <View style={styles.conteinerBoton}>
        <TouchableOpacity style={styles.boton} onPress={ReporteUsuario}>
          <Text style={styles.textoBoton}>Eliminar Publicación</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boton} onPress={ReporteUsuario}>
          <Text style={styles.textoBoton}>Banear Usuario</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
  containerCarrusel: {
    height: 300,
  },
  carrusel: {
    
  },
  text1: {
    fontSize: 25,
    fontWeight: "600",
    marginHorizontal: 20,
    marginTop: 20,
  },
  text2: {
    fontSize: 18,
    fontWeight: "500",
    marginHorizontal: 20,
    marginTop: 10
  },
  nombreUser:{
    fontSize: 23,
    fontWeight: "500",
    marginHorizontal: 20,
    marginTop: 30,
    marginLeft: 240,
  },
  imageUser: {
    width: 100,
    height: 100,
    marginTop: 20,
    marginLeft: 250,
  },
  conteinerBoton: {
    alignItems: "center",
    marginTop: 30,
  },
  boton: {
    backgroundColor: "#cc0000",
    borderRadius: 25,
    paddingVertical: 10,
    width: 170,
    marginTop: 20,
  },
  textoBoton: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
});
