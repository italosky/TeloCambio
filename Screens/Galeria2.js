import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import { Drawer, AnimatedFAB } from "react-native-paper";
import { auth } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Galeria2() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExtended, setIsExtended] = useState(true);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [numColumns, setNumColumns] = useState(2);
  const drawer = useRef(null);
  const [drawerPosition, setDrawerPosition] = useState("left");

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const allItemsArray = [];
      const articulosPublicadosRef = collection(db, "Publicaciones");
      const usersSnapshot = await getDocs(articulosPublicadosRef);
      usersSnapshot.forEach((postDoc) => {
        const postData = postDoc.data();
        allItemsArray.push({
          id: postDoc.id,
          imagenURL: postData.imagenURL,
          imagenURL2: postData.imagenURL2,
          imagenURL3: postData.imagenURL3,
          nombreArticulo: postData.nombreArticulo,
          tipo: postData.tipo,
          estadoArticulo: postData.estadoArticulo,
          comuna: postData.comuna,
        });
      });
      setDataSource(allItemsArray);
    } catch (error) {
      console.error("Error al cargar los artículos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //ESTE USEEFFECT HACE QUE LA GALERIA SE REFRESQUE PARA VER EL ARTICULO RECIEN SUBIDO
    const unsubscribe = navigation.addListener("focus", () => {
      fetchPosts();
    });
    fetchPosts();
    return unsubscribe;
  }, [navigation]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,
    });
  }, [navigation]);

  const cerrarSesion = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem("isLoggedIn");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

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

  const goSubirArticulos = () => {
    navigation.navigate("SubirArticulos");
  };

  const changeDrawerPosition = () => {
    if (drawerPosition === "left") {
      setDrawerPosition("right");
    } else {
      setDrawerPosition("left");
    }
  };

  const renderDrawerAndroid = () => (
    <DrawerLayout
      ref={drawer}
      drawerWidth={200}
      drawerPosition={drawerPosition}
      renderNavigationView={navigationView}
    >
      <View style={styles.container}>
        {loading ? (
          <Text>Cargando...</Text>
        ) : (
          <FlatList
            data={dataSource}
            renderItem={renderItem}
            numColumns={numColumns}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.gridContainer}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        )}
      </View>
      <AnimatedFAB
        icon="plus"
        label="Subir Artículo"
        onPress={goSubirArticulos}
        style={styles.fabStyle}
        extended={isExtended}
        visible={true}
        animateFrom={"right"}
        iconMode={"static"}
        color="white"
      />
    </DrawerLayout>
  );

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

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image style={styles.imageThumbnail} source={{ uri: item.imagenURL }} />
      <View style={styles.itemOverlay}>
        <Text style={styles.itemName}>{item.nombreArticulo || ""}</Text>
        <Text style={styles.itemInfo}>{item.estadoArticulo || ""}</Text>
        <Text style={styles.itemInfo}>{item.comuna || ""}</Text>
        {item.tipo === "Intercambiar artículo" && (
          <TouchableOpacity style={[styles.teLoCambioButton]}>
            <Text style={styles.teLoCambioButtonText}>TELOCAMBIO</Text>
          </TouchableOpacity>
        )}
        {item.tipo === "Regalar artículo" && (
          <TouchableOpacity style={[styles.teLoRegaloButton]}>
            <Text style={styles.teLoRegaloButtonText}>TELOREGALO</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return Platform.OS === "ios" ? renderDrawerAndroid() : renderDrawerAndroid();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
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
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 2,
    alignItems: "center",
  },
  drawerText: {
    fontSize: 18,
    color: "#ffffff",
    padding: 12,
  },
  separatorLine: {
    borderBottomWidth: 0.5,
    color: "gray",
    marginVertical: 15,
    marginHorizontal: 15,
  },
  logo: {
    width: 255,
    height: 55,
  },
  fabStyle: {
    bottom: 40,
    right: 16,
    position: "absolute",
    backgroundColor: "#8AAD34",
  },
  logoutButton: {
    alignItems: "center",
    marginTop: 20,
  },
  logoutImage: {
    width: 80,
    height: 80,
  },
  gridContainer: {
    padding: 0,
  },
  itemContainer: {
    flex: 1,
    flexDirection: "column",
    margin: 2,
    position: "relative",
  },
  imageThumbnail: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    width: "100%",
    resizeMode: "cover",
  },
  itemOverlay: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: "100%",
    padding: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  itemInfo: {
    fontSize: 14,
    color: "#FFF",
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
});
