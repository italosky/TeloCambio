import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { Drawer } from "react-native-paper";

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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,
    });
  }, [navigation]);

  const goMiPerfil = () => {
    navigation.navigate("MiPerfil");
  };

  const goGaleria2 = () => {
    navigation.navigate("Galeria2");
  };

  const goMisPublicados = () => {
    navigation.navigate("MisPublicados");
  };

  const goMisOfertas = () => {
    navigation.navigate("MisOfertas");
  };

  const drawer = useRef(null);
  const [drawerPosition, setDrawerPosition] = useState("left");

  const changeDrawerPosition = () => {
    if (drawerPosition === "left") {
      setDrawerPosition("right");
    } else {
      setDrawerPosition("left");
    }
  };

  const cerrarSesion = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem("isLoggedIn");
      navigation.navigate("Ingreso");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const navigationView = () => (
    <View style={[styles.containerDrawer, styles.navigationContainer]}>
      <View>
        <Image
          source={require("../assets/LogoTeLoCambio.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.separatorLine} />

      <Drawer.Section>
        <TouchableOpacity style={styles.drawerItem} onPress={goMiPerfil}>
          <Text style={styles.drawerText}>Mi Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={goGaleria2}>
          <Text style={styles.drawerText}>Galería de Artículos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={goMisPublicados}>
          <Text style={styles.drawerText}>Mis Publicados</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem} onPress={goMisOfertas}>
          <Text style={styles.drawerText}>Mis Ofertas</Text>
        </TouchableOpacity>
      </Drawer.Section>

      <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
        <Image
          source={require("../assets/Salir.png")}
          style={styles.logoutImage}
        />
      </TouchableOpacity>
    </View>
  );

  const renderDrawerAndroid = () => (
    <DrawerLayout
      ref={drawer}
      drawerWidth={200}
      drawerPosition={drawerPosition}
      renderNavigationView={navigationView}
    >
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
    </DrawerLayout>  
  );

  return Platform.OS === "ios" ? renderDrawerAndroid() : renderDrawerAndroid();
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
  containerDrawer: {
    flex: 1,
    padding: 5,
  },
  navigationContainer: {
    backgroundColor: "#ecf0f1",
  },
  drawerItem: {
    backgroundColor: "#8AAD34",
    marginBottom: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  drawerText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#ffffff",
    padding: 10,
  },
  separatorLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#7A7A7A",
    margin: 15,
  },
  logo: {
    width: 255,
    height: 55,
  },
  logoutButton: {
    alignItems: "center",
    marginTop: 20,
  },
  logoutImage: {
    width: 80,
    height: 80,
  },
});