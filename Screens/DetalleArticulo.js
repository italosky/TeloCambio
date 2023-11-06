import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { Card } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { Drawer } from "react-native-paper";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DetalleArticulo() {
  const navigation = useNavigation();
  const route = useRoute();
  const item = route.params?.item;
  const [mostrarModal, setMostrarModal] = useState(false);
  const [articulos, setArticulos] = useState([]);
  const [articleId, setarticleId] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [indiceImagenAmpliada, setIndiceImagenAmpliada] = useState(0);
  const [userData, setUserData] = useState(null);
  const userID = auth.currentUser ? auth.currentUser.uid : null; // UID DEL USUARIO LOGEADO ACTUALMENTE
  const userId = item.id.match(/-(.*)/)[1];
  const images = [item.imagenURL, item.imagenURL2, item.imagenURL3];
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log("Fetching user data for userId:", userId);
      if (!userId) return;
      try {
        const usuariosCollection = collection(db, "Usuarios");
        const usuariosQuery = query(
          usuariosCollection,
          where("uid", "==", userId)
        );
        const usuariosSnapshot = await getDocs(usuariosQuery);
        if (!usuariosSnapshot.empty) {
          const userDataFromSnapshot = usuariosSnapshot.docs[0].data();
          setUserData(userDataFromSnapshot);
        } else {
          console.log("No se encuentra el uid");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, [userId]);

  useEffect(() => {
    if (userData && userData.role) {
      setUserRole(userData.role);
    }
  }, [userData]);

  const createOfferCollection = async (articleId) => {
    try {
      const offersRef = collection(db, "Ofertas");
      const q = query(
        offersRef,
        where("ArticuloOferta", "==", articleId),
        where("ArticuloGaleria", "==", item.id),
        limit(1)
      );
      const existingOfferSnap = await getDocs(q);
      if (!existingOfferSnap.empty) {
        console.log(
          "Ya existe una oferta para este artículo por el usuario actual."
        );
        return;
      }
      const offerDoc = {
        UsuarioOferta: userID,
        ArticuloOferta: articleId,
        ArticuloGaleria: item.id,
        UsuarioGaleria: userId,
        Estado: "pendiente",
        fecha: serverTimestamp(),
      };
      await addDoc(offersRef, offerDoc);
      console.log("Documento de oferta añadido con éxito");
    } catch (error) {
      console.error("Error al añadir el documento:", error);
    }
  };

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
  const goReporteUsuario = () => {
    navigation.navigate("ReporteUsuario");
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

  const confirmarReclamo = () => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de que deseas reclamar este artículo?",
      [
        {
          text: "No",
          style: "cancel",
        },
        { text: "Sí", onPress: navigateToDatosCambio },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    const fetchPublicaciones = async () => {
      try {
        const publicacionesCollection = collection(db, "Publicaciones");
        const publicacionesQuery = query(
          publicacionesCollection,
          where("uid", "==", userID)
        );
        const publicacionesSnapshot = await getDocs(publicacionesQuery);
        const publicacionesData = publicacionesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Publicaciones:", publicacionesData);
        setArticulos(publicacionesData);
      } catch (error) {
        console.error("Error al obtener las publicaciones:", error);
      }
    };
    fetchPublicaciones();
  }, [userID]);

  const [modalArticulo, setModalArticulo] = useState(false);

  const closeModal = () => {
    setModalArticulo(false);
  };

  const openModal = () => {
    setModalArticulo(true);
  };

  const ArticuloModal = (nombreArticulo, id) => {
    Alert.alert(
      "Atención",
      `¿Deseas intercambiar por ${nombreArticulo}?`,
      [
        {
          text: "No",
          onPress: () => {
            setSelectedCard(null);
            setarticleId(null);
          },
          style: "cancel",
        },
        {
          text: "Sí",
          onPress: async () => {
            closeModal();
            await createOfferCollection(id);
            Alert.alert(
              "Felicidades",
              "Tu solicitud de oferta ha sido ingresada con exito",
              [
                {
                  text: "OK",
                  onPress: () => navigation.navigate("Galeria2"),
                },
              ]
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    console.log(
      "Después de establecer el estado - ID seleccionado:",
      selectedCard
    );
    console.log(
      "Después de establecer el estado - ID de artículo ofrecido:",
      articleId
    );
  }, [selectedCard, articleId]);

  const [columns, setColumns] = useState(1);

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
            <Text style={styles.tittle}>{item.nombreArticulo}</Text>
            <Swiper
              showsButtons={true}
              loop={false}
              autoplay={false}
              onIndexChanged={(index) => setIndiceImagenAmpliada(index)}
              dotStyle={styles.dot}
              activeDot={<View style={styles.activeDot} />}
              nextButton={<Text style={styles.buttonSwiper}>❯</Text>}
              prevButton={<Text style={styles.buttonSwiper}>❮</Text>}
            >
              {images.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => toggleModal(index)}
                >
                  <Image
                    source={{ uri: item }}
                    style={styles.imageCarrusel}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </Swiper>
          </View>

          {userData && (
            <View style={styles.userProfile}>
              <Image
                source={{ uri: userData.imagenen[0] }}
                style={styles.imageUser}
              />
              <Text style={styles.nombreUser}>{userData.nombre_apellido}</Text>
              {item.tipo === "Intercambiar artículo" && (
                <TouchableOpacity
                  style={[styles.teLoCambioButton]}
                  onPress={openModal}
                >
                  <Text style={styles.teLoCambioButtonText}>TELOCAMBIO</Text>
                </TouchableOpacity>
              )}
              {item.tipo === "Regalar artículo" && (
                <TouchableOpacity
                  style={[styles.teLoRegaloButton]}
                  onPress={confirmarReclamo}
                >
                  <Text style={styles.teLoRegaloButtonText}>TELOREGALO</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        <View style={styles.containerText}>
          <Text style={styles.text}>Estado: {item.estadoArticulo}</Text>
          <Text style={styles.text}>Comuna: {item.comuna}</Text>
        </View>
        

        <View style={styles.containerBoton}>
          {userRole === "admin" && (
              <TouchableOpacity style={styles.boton} onPress={ReporteUsuario}>
                <Text style={styles.textoBoton}>Eliminar Publicación</Text>
              </TouchableOpacity>
          )}
          {userRole === "usuario" && (
            <TouchableOpacity style={styles.boton} onPress={ReporteUsuario}>
              <Text style={styles.textoBoton}>Reportar Usuario</Text>
            </TouchableOpacity>
          )}
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

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalArticulo}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Disponible para Intercambio</Text>

              <FlatList
                style={styles.containerFlastList}
                numColumns={columns}
                data={articulos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Card
                    key={item.id}
                    style={[
                      styles.containerCard,
                      selectedCard === item.id ? { borderWidth: 2 } : {},
                    ]}
                    onPress={() => {
                      console.log(
                        "Tarjeta seleccionada:",
                        item.nombreArticulo,
                        item.id
                      );
                      ArticuloModal(item.nombreArticulo, item.id);
                    }}
                  >
                    <View style={styles.containerImagen}>
                      <Card.Cover
                        source={{ uri: item.imagenURL }}
                        style={styles.imagen}
                      />
                      <View style={styles.textContainer}>
                        <Text style={styles.titleCard}>
                          {item.nombreArticulo}
                        </Text>
                        <Text style={styles.titleEstado}>
                          {item.estadoArticulo}
                        </Text>
                      </View>
                    </View>
                  </Card>
                )}
              />
            </View>
            <TouchableOpacity style={styles.cerrarButton} onPress={closeModal}>
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
    paddingTop: 90,
    alignItems: "center",
  },
  containerSwiper: {
    flex: 1,
    height: "100%",
    marginRight: 20,
    backgroundColor: "#ffffff",
  },
  buttonSwiper: {
    color: "#ffffff",
    fontSize: 42,
    opacity: 70,
  },
  imageCarrusel: {
    width: "100%",
    height: 170,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  userInfoContainer: {
    flexDirection: "row",
    width: 364,
    height: 240,
    fontSize: 70,
    marginTop: 30,
    paddingHorizontal: 5,
    backgroundColor: "#ffffff",
  },
  tittle: {
    fontSize: 20,
    fontWeight: "700",
    marginVertical: 20,
    textAlign: "center",
  },
  containerText:{
    width: "45%",
    marginRight: 175,
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
    paddingTop: 10,
  },
  userProfile: {
    alignItems: "center",
    marginTop: 60,
    backgroundColor: "#ffffff",
  },
  nombreUser: {
    fontSize: 19,
    fontWeight: "500",
    marginTop: 18,
    marginBottom: 15,
  },
  imageUser: {
    width: 115,
    height: 115,
    borderRadius: 58,
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
    width: 8.5,
    height: 8.5,
    borderRadius: 5,
    backgroundColor: "gray",
    alignItems: "center",
    marginBottom: 0.1,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
  teLoCambioButton: {
    paddingVertical: 10,
    paddingHorizontal: 45,
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
    paddingVertical: 10,
    paddingHorizontal: 45,
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: "#efb810",
  },
  teLoRegaloButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    alignItems: "flex-start",
    height: 360,
    width: 300,
    borderColor: "#63A355",
    borderWidth: 2.0,
  },
  modalText: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 20,
    marginBottom: 5,
    paddingStart: 12,
  },
  containerFlastList: {
    marginBottom: 1,
  },
  containerCard: {
    width: 263,
    height: 110,
    borderRadius: 11,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    marginTop: 5,
    alignItems: "flex-start",
    borderWidth: 0.3,
  },

  containerImagen: {
    marginTop: 6,
    alignItems: "center",
    marginHorizontal: 5,
    flexDirection: "row",
  },
  imagen: {
    width: 100,
    height: 95,
    borderRadius: 7,
  },
  titleCard: {
    fontSize: 17,
    textAlign: "auto",
    flexDirection: "row",
  },
  titleEstado: {
    marginTop: 5,
  },
  textContainer: {
    flexDirection: "column",
    marginLeft: 10,
  },
});
