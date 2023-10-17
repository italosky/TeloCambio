import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Carousel, { Pagination } from 'react-native-snap-carousel'; // eslint-disable-next-line react/prop-types

export default function DetalleArticulo() {
  const navigation = useNavigation();
  
  const { width } = Dimensions.get('window');
  const carouselRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

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

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => toggleModal(index)}>
        <View style={styles.slide}>
          <Image source={item} style={styles.imageCarrusel} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <View style={styles.userDetails}>
          <Text style={styles.text1}>Patines</Text>
          <Carousel
            ref={carouselRef}
            data={images}
            renderItem={renderItem}
            sliderWidth={150} // Ancho del carrusel
            itemWidth={200} // Ancho de cada elemento del carrusel
            onSnapToItem={(index) => setActiveSlide(index)}
          />
          <Pagination
            dotsLength={images.length}
            activeDotIndex={activeSlide}
            containerStyle={{ backgroundColor: 'transparent', paddingTop: 10 }}
            dotStyle={styles.paginationDot}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.7}
          />
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
    paddingTop: 60,
  },
  slide: {
    width: - 60,
    height: 150, // Altura de las imágenes en el carrusel
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    marginTop: 25,
  },
  imageCarrusel: {
    width: 150,
    height: 150,
    borderRadius: 5,
  },
  userInfoContainer: {
    flexDirection: "row",
    paddingHorizontal: 30,
    marginTop: 40,
  },
  userDetails: {
    flex: 1,
    alignItems: "flex-start",
  },
  userProfile: {
    alignItems: "center",
    marginRight: 5,
    marginTop: 50,
  },
  text1: {
    fontSize: 25,
    fontWeight: "600",
  },
  text2: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 10,
  },
  nombreUser:{
    fontSize: 20,
    fontWeight: "500",
    marginTop: 15,
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
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: 'green',
  },
  containerText: {
    justifyContent: "space-around",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  imageModal: {
    width: 300,
    height: 300,
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