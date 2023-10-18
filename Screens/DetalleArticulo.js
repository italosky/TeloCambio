import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Swiper from "react-native-swiper";

export default function DetalleArticulo() {
  const navigation = useNavigation();
  
  

  const [mostrarModal, setMostrarModal] = useState(false);
  const [indiceImagenAmpliada, setIndiceImagenAmpliada] = useState(0);

  const images = [
    require('./assets,articulos/Patines.png'),
    require('./assets,articulos/LucesBici.png'),
    require('./assets,articulos/Lentes.png'),
  ];

  const ReporteUsuario = () => {
    navigation.navigate("ReporteUsuario");
  };

  const toggleModal = (index) => {
    setIndiceImagenAmpliada(index);
    setMostrarModal(!mostrarModal);
  };

  return (
    
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <View style={styles.containerSwiper}>
          <Text style={styles.tittle}>Patines</Text>
          <Swiper
            showsButtons={true}
            loop={false}
            autoplay={false}
            onIndexChanged={(index) => setIndiceImagenAmpliada(index)}
            dotStyle={styles.dot}
            activeDot={<View style={styles.activeDot}/>}
            nextButton={<Text style={styles.buttonSwiper}>❯</Text>} // Botón siguiente
            prevButton={<Text style={styles.buttonSwiper}>❮</Text>} // Botón anterior
          >
            {images.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => toggleModal(index)}>
                <Image source={item} style={styles.imageCarrusel} />
              </TouchableOpacity>
            ))}
          </Swiper>
          <Text style={styles.text2}>• Usado</Text>
          <Text style={styles.text2}>• Intercambio</Text>
        </View>
        <View style={styles.userProfile}>
          <Image source={require("../assets/FotoPerfil.com.png")} style={styles.imageUser}/>
          <Text style={styles.nombreUser}>Juanito Perez</Text>
        </View>
      </View>

      <View style={styles.containerBoton}>
        <TouchableOpacity style={styles.boton} onPress={ReporteUsuario}>
          <Text style={styles.textoBoton}>Eliminar Publicación</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boton} onPress={ReporteUsuario}>
          <Text style={styles.textoBoton}>Banear Usuario</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={mostrarModal} transparent={true}>
        <View style={styles.modalContainer}>
          <Image
            source={images[indiceImagenAmpliada]}
            style={styles.imageModal}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.cerrarButton}
            onPress={() => toggleModal(indiceImagenAmpliada)}
          >
            <Text style={styles.cerrarButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 80,
    alignItems: "center"
  },
  containerSwiper:{
    flex: 1,
    marginRight: 50,
    marginTop: -25,
  },
  buttonSwiper: {
    color: '#353535',
    fontSize: 50,
  },
  imageCarrusel: {
    width: 170,
    height: 170,
    borderRadius: 5,
  },
  userInfoContainer: {
    flexDirection: "row",
    width: 320,
    height: 300,
    fontSize: 70,
    marginTop: 30,
  },
  tittle: {
    fontSize: 25,
    fontWeight: "600",
    marginVertical: 20,
  },
  text2: {
    fontSize: 18,
    fontWeight: "500",
  },
  userProfile: {
    alignItems: "center",
    marginTop: 50,
  },
  nombreUser:{
    fontSize: 20,
    fontWeight: "500",
    marginTop: 23,
  },
  imageUser: {
    width: 90,
    height: 90,
  },
  containerBoton: {
    alignItems: "center",
    marginTop: 100,
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
  dot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#404040',
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#1BA209',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  imageModal: {
    width: 350,
    height: 350,
  },
  cerrarButton: {
    marginTop: 20,
  },
  cerrarButtonText: {
    color: "white",
    fontSize: 18,
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
  },
});