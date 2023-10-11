import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Modal, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from "../firebaseConfig";

export default function PublicacionReportada() {
  const navigation = useNavigation();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [indiceImagenAmpliada, setIndiceImagenAmpliada] = useState(0);

  const route = useRoute();
  const { params } = route;
  const { nombreArticulo, imagenes, estadoArticulo, comuna, causaReporte, detalleReporte, fechaReporte } = params;

  const toggleModal = (index) => {
    setIndiceImagenAmpliada(index);
    setMostrarModal(!mostrarModal);
  };

  const eliminarReporte = () => {
    const item = params
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de eliminar el reporte?",
      [
        {
          text: "No",
          onPress: () => console.log("Eliminación cancelada"),
          style: "cancel"
        },
        {
          text: "Sí", 
          onPress: async () => {
            try {
              console.log("Dentro de eliminarReporte:", item.id);
              const reporteRef = doc(db, 'Reportes', item.id);
              await deleteDoc(reporteRef);
              Alert.alert(
                "¡Éxito!",
                "El reporte ha sido eliminado.",
              );
              navigation.navigate("ListaReportesAdmin")
            } catch (error) {
              console.error("Error al eliminar el reporte:", error);
            }
          }
        }
      ],
      { cancelable: false }
  );
  }

  const eliminarPublicacion = () => {
    const item = params
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de eliminar la publicacion?",
      [
        {
          text: "No",
          onPress: () => console.log("Eliminación cancelada"),
          style: "cancel"
        },
        {
          text: "Sí", 
          onPress: async () => {
            try {
              console.log("Dentro de eliminarPublicacion:", item);
              const PublicacionRef = doc(db, 'Publicaciones', item.publicacionId);
              await deleteDoc(PublicacionRef);
              Alert.alert(
                "¡Éxito!",
                "La publicación ha sido eliminada.",
              );
              navigation.navigate("ListaReportesAdmin")
            } catch (error) {
              console.error("Error al eliminar la publicación:", error);
            }
          }
        }
      ],
      { cancelable: false }
  );
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerSwiper}>
        <Swiper
          showsButtons={true}
          loop={false}
          autoplay={false}
          onIndexChanged={(index) => setIndiceImagenAmpliada(index)}
          dotStyle={styles.dot}
          activeDot={<View style={styles.activeDot}/>}
          nextButton={<Text style={styles.buttonSwiper}>❯</Text>}
          prevButton={<Text style={styles.buttonSwiper}>❮</Text>}
        >
          {imagenes.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => toggleModal(index)}>
              <Image source={{ uri: item }} style={styles.imageCarrusel} resizeMode="contain" />
            </TouchableOpacity>
          ))}
        </Swiper>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.tittle}>{nombreArticulo}</Text>
        <Text style={styles.text2}>Estado: {estadoArticulo}</Text>
        <Text style={styles.text2}>Comuna: {comuna}</Text>
        <Text style={styles.text2}>Causa del Reporte: {causaReporte}</Text>
        <Text style={styles.text2}>Detalle del Reporte: {detalleReporte}</Text>
        <Text style={styles.text2}>Fecha del Reporte: {fechaReporte}</Text>
      </View>
      <Modal visible={mostrarModal} transparent={true}>
        <View style={styles.modalContainer}>
          <Image
            source={{ uri: imagenes[indiceImagenAmpliada] }}
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
      <View style={styles.containerBoton}>
        <TouchableOpacity style={styles.boton} onPress={eliminarPublicacion}>
          <Text style={styles.textoBoton}>Eliminar Publicación</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boton2} onPress={eliminarReporte}>
          <Text style={styles.textoBoton}>Eliminar Reporte</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 0,
    alignItems: "center",
  },
  containerSwiper: {
    flex: 1,
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  buttonSwiper: {
    color: "#ffffff",
    fontSize: 62,
    opacity: 70,
    paddingHorizontal: 45,
  },
  imageCarrusel: {
    width: Dimensions.get("window").width,
    height: 300,
    borderRadius: 0,
  },
  textContainer: {
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  tittle: {
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    marginVertical: 10,
  },
  text2: {
    fontSize: 18,
    fontWeight: "500",
    marginVertical: 5,
  },
  containerBoton: {
    alignItems: "center",
    marginBottom: 40,
  },
  boton: {
    backgroundColor: "#cc0000",
    borderRadius: 25,
    paddingVertical: 10,
    width: 170,
    marginTop: 10,
  },
  boton2: {
    backgroundColor: "#8AAD34",
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
    width: 8.5,
    height: 8.5,
    borderRadius: 5,
    backgroundColor: "gray",
    alignItems: "center",
  },
  activeDot: {
    width: 15,
    height: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: "#ffffff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  imageModal: {
    width: Dimensions.get("window").width - 40,
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
