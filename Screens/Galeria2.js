import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  SafeAreaView,
} from "react-native";
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import { Drawer, AnimatedFAB } from "react-native-paper";
import { auth } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function Home() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [isExtended, setIsExtended] = React.useState(true);
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const allItemsArray = [];
        const articulosPublicadosRef = collection(db, 'Publicaciones');
        const usersSnapshot = await getDocs(articulosPublicadosRef);
        for (const userDoc of usersSnapshot.docs) {
          const userId = userDoc.id;
          // Asumiendo que tienes una subcolección, reemplazar 'Items' con el nombre real de tu subcolección.
          const userPostsRef = collection(articulosPublicadosRef, userId, 'Items'); 
          const userPostsSnapshot = await getDocs(userPostsRef);
          userPostsSnapshot.forEach((postDoc) => {
            const postData = postDoc.data();
            allItemsArray.push({
              id: postDoc.id,
              src: postData.imagenURL,
              nombreArticulo: postData.nombreArticulo,
              tipo: postData.tipo,
              estadoarticulo: postData.estadoarticulo,
              comuna: postData.comuna,
            });
          });
        }
        console.log(allItemsArray);
        setItems(allItemsArray);
      } catch (error) {
        console.error("Error al cargar los artículos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  
  
  
  useEffect(() => {
    let items = Array.apply(null, Array(60)).map((v, i) => {
      return { id: i, src: 'http://placehold.it/200x200?text=' + (i + 1) };
    });
    setDataSource(items);
  }, []);

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

  const [numColumns, setNumColumns] = useState(2);

  

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

  const drawer = useRef(null);
  const [drawerPosition, setDrawerPosition] = useState("left");

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
      drawerWidth={300}
      drawerPosition={drawerPosition}
      renderNavigationView={navigationView}
    >
      <View style={styles.container}>
        {items.length > 0 ? (
          <FlatList
            data={items}
            renderItem={renderItem}
            numColumns={numColumns}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.gridContainer}
          />
        ) : (
          <Text>No hay artículos para mostrar</Text>
        )}
      </View>
      {/* Otros componentes */}
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
      <Image style={styles.imageThumbnail} source={{ uri: item.src }} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.nombreArticulo}</Text> {/* Asegúrate que estos campos existen */}
        <Text style={styles.itemInfo}>{item.estadoarticulo}</Text> {/* Asegúrate que estos campos existen */}
        <Text style={styles.itemInfo}>{item.comuna}</Text> {/* Asegúrate que estos campos existen */}
      </View>
    </View>
  );
  
  

  // Resto de tus componentes y funciones

  return Platform.OS === "ios" ? renderDrawerAndroid() : renderDrawerAndroid();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  containerDrawer: {
    flex: 1,
    padding: 16,
  },
  navigationContainer: {
    backgroundColor: "#ecf0f1",
  },
  drawerItem: {
    backgroundColor: "#8AAD34",
    margin: 10,
    borderRadius: 30,
  },
  drawerText: {
    fontSize: 18,
    fontWeight: "500",
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
    width: 260,
    height: 47,
  },
  fabStyle: {
    bottom: 40,
    right: 16,
    position: "absolute",
    backgroundColor: "#8AAD34",
  },
  logoutButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoutImage: {
    width: 100,
    height: 100,
  },
  gridContainer: {
    padding: 0,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    margin: 2,
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    
  },
  itemDetails: {
    backgroundColor: "white",
    padding: 10,
    width: "100%",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    position: "absolute",
    bottom: 0,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemInfo: {
    fontSize: 14,
  },
});
