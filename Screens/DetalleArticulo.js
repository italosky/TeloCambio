import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Modal, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Swiper from "react-native-swiper";


export default function DetalleArticulo() {
  const navigation = useNavigation();
  const route = useRoute();
  const item = route.params?.item;
  const [mostrarModal, setMostrarModal] = useState(false);
  const [indiceImagenAmpliada, setIndiceImagenAmpliada] = useState(0);
  const images = [
    item.imagenURL,
    item.imagenURL2,
    item.imagenURL3
  ];
  
  const navigateToDatosCambio = () => {
    navigation.navigate("DatosCambio", { item });
  };

  const ReporteUsuario = () => {
    navigation.navigate("ReporteUsuario");
  };

  const toggleModal = (index) => {
    setIndiceImagenAmpliada(index);
    setMostrarModal(!mostrarModal);
  };

  const confirmarReclamo = () => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas reclamar este artículo?", 
      [
        {
          text: "No",
          style: "cancel"
        },
        { text: "Sí", onPress: navigateToDatosCambio }
      ],
      { cancelable: false }
    );
  }  

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <View style={styles.containerSwiper}>
          <Text style={styles.tittle}>{item.nombreArticulo}</Text>
          <Swiper
            showsButtons={true}
            loop={false}
            autoplay={false}
            onIndexChanged={(index) => setIndiceImagenAmpliada(index)}
           dotStyle={styles.dotContainer}
            activeDot={<View style={styles.activeDot} />}
            nextButton={<Text style={styles.buttonSwiper}>❯</Text>}
            prevButton={<Text style={styles.buttonSwiper}>❮</Text>}
          >
            {images.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => toggleModal(index)}>
                <Image source={{ uri: item }} style={styles.imageCarrusel} resizeMode="cover"/>
              </TouchableOpacity>
            ))}
          </Swiper>
          <Text style={styles.text2}>Estado: {item.estadoArticulo}</Text>
          <Text style={styles.text2}>Comuna: {item.comuna}</Text>
        </View>
        <View style={styles.userProfile}>
          <Image source={require("../assets/FotoPerfil.com.png")} style={styles.imageUser} />
          <Text style={styles.nombreUser}> Juanito{item.usuario}</Text>
          {item.tipo === "Intercambiar artículo" && (
            <TouchableOpacity style={[styles.teLoCambioButton]}>
              <Text style={styles.teLoCambioButtonText}>TELOCAMBIO</Text>
            </TouchableOpacity>
          )}
          {item.tipo === "Regalar artículo" && (
            <TouchableOpacity style={[styles.teLoRegaloButton]} onPress={confirmarReclamo}>
              <Text style={styles.teLoRegaloButtonText}>TELOREGALO</Text>
            </TouchableOpacity>
          )}
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
            source={{ uri: images[indiceImagenAmpliada] }}
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
    paddingTop: 90,
    alignItems: "center"
  },
  containerSwiper:{
    flex: 1,
    marginRight: 55,
    backgroundColor:  "#ffffff",
  },
  buttonSwiper: {
    color: "#ffffff",
    fontSize: 40,
  },
  imageCarrusel: {
    width: 170,
    height: 170,
    borderRadius: 5,
    position: 'absolute',
  },
  userInfoContainer: {
    flexDirection: "row",
    width: 320,
    height: 300,
    fontSize: 70,
    marginTop: 30,
  },
  tittle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 20,
    textAlign: "center",
  },
  text2: {
    fontSize: 18,
    fontWeight: "500",
    paddingBottom: 10,
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
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 0,
    backgroundColor: "#ffffff",
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: "gray",
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
  teLoCambioButton: {
    alignSelf: "flex-end",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: "#63A355",
  },
  teLoCambioButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  teLoRegaloButton: {
    alignSelf: "flex-end",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: "#efb810",
  },
  teLoRegaloButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  dotContainer: {
    flexDirection: "row", 
    alignItems: "center", 
    marginTop: 0, 
  },
});