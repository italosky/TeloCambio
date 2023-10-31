import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Card } from 'react-native-paper';
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { useNavigation, useRoute } from "@react-navigation/native";
import { products } from "./common/Articulos";
import { FlatList } from "react-native-gesture-handler";
import { Drawer, Card } from "react-native-paper";
import { db, auth } from "../firebaseConfig";

export default function MisOfertas({ route }) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [numColumns, setNumColumns] = useState(2);
  const [itemName, setItemName] = useState("");
  const [itemCondition, setItemCondition] = useState("");
  const [selectedComuna, setSelectedComuna] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [itemTrade, setItemTrade] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [dataSource, setDataSource] = useState([]);

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

  const goDetalleArticulo = () => {
    // Navega a la pantalla 'DetalleArticulo'
    navigation.navigate('DetalleArticulo', { itemId: item.id });
  };

  const [active, setActive] = React.useState("");

  
  const realizarOferta = async (Ofertas) => {
    try {
      if (!itemName || !itemCondition || !selectedComuna || !selectedRegion || !itemTrade || !selectedImages.length || !userId) {
        console.error("Algunas variables contienen valores no válidos.");
        return;
      }
      const [url1, url2, url3] = urls;
      const offerData = collection(db, Ofertas);
      await setDoc(offerData, {
        nombreArticulo: itemName,
        estadoArticulo: itemCondition,
        comuna: selectedComuna.name,
        region: selectedRegion.name,
        tipo: itemTrade,
        imagenURL: url1,
        imagenURL2: url2,
        imagenURL3: url3,
        uid: userId,
      });
      console.log(`Nueva colección "${Ofertas}" creada con éxito.`);
    } catch (error) {
      console.error("Error al crear la colección:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const allItemsArray = [];
      const articulosPublicadosRef = await getDocs(query(collection(db, "Publicaciones"), where("uid", "==", userId)));
      articulosPublicadosRef.forEach((offerReceived) => {
        const offerData = offerReceived.data();
        allItemsArray.push({
          uid: offerReceived.id,  
          imagenURL: offerData.imagenURL,
          nombreArticulo: offerData.nombreArticulo,
          tipo: offerData.tipo,
          estadoArticulo: offerData.estadoArticulo,
          comuna: offerData.comuna,
        });
      });  
      setDataSource(allItemsArray);
    } catch (error) {
      console.error("Error al cargar los artículos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, "Ofertas", itemId));
      setDataSource((prevData) => prevData.filter(item => item.uid !== itemId));
    } catch (error) {
      console.error("Error al eliminar el artículo:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchPosts();
    });
    if (userId){
      fetchPosts();
    }
    return unsubscribe;
  }, [navigation, userId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const renderItem = ({item}) => {
    return (
      <Card style={styles.containerCard} onPress={goMiPerfil}> 
        <Card.Title
        style={styles.containerCardContent} 
        title={<Text style={styles.textCard} >{item.nombreArticulo}</Text>} 
        subtitle={<Text style={styles.textCardDate} >Publicado el {item.fecha}</Text>}
        left={(props) => <Image style={styles.imagenList} source={{ uri: item.imagenURL }} />}
        right={(props) => (
          <TouchableOpacity
            onPress={() => handleDeleteItem(item.uid)}
          >
            <Image source={require("../assets/Eliminar.png")} style={styles.iconList} />
          </TouchableOpacity>
        )}
        />
      </Card>
    );
  };

  const renderDrawerAndroid = () => (
    <DrawerLayout
      ref={drawer}
      drawerWidth={200}
      drawerPosition={drawerPosition}
      renderNavigationView={navigationView}
    >
      <View style={{ marginTop: 15 }}>
        <FlatList
          data={AccesoriosList}
          renderItem={({ item, index }) => {
            return (
              <Card style={styles.containerCard} onPress={goDetalleArticulo}> 
                <Card.Title
                  style={styles.containerCardContent} 
                  left={(props) => (
                    <View style={styles.exchangeContainer} >
                      <View style={styles.leftContainer}>
                        <Image source={item.imagen} style={styles.imagen}/>
                        <Text style={styles.textCardOne} >{item.nombre}</Text> 
                      </View>
                      <View>
                        <Image source={require("../assets/FlechaIntercambio.png")} style={styles.exchangeArrow}/>
                      </View>
                    </View>
                  )}
                  right={(props) => (
                    <View style={styles.exchangeContainer}>
                      <View style={styles.rightContainer}>
                        <Image source={item.imagen} style={styles.imagen}/>
                        <Text style={styles.textCard} >{item.nombre}</Text> 
                      </View>
                      <Image source={require("../assets/Eliminar.png")} style={styles.icon}/>
                    </View>
                  )}
                />
              </Card>
            );
          }}
        />
      </View>
    </DrawerLayout>
  );

  return Platform.OS === "ios" ? renderDrawerAndroid() : renderDrawerAndroid();
}

const styles = StyleSheet.create({
  containerCardContent: {
    width: '100%',
    height: 140,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  containerCard: {
    borderRadius: 10,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  textCard: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  textCardOne: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginHorizontal: 3
  },
  textCardDate: {
    fontSize: 15,
    marginLeft: 25,
    marginEnd: 20,
    marginTop: 23
  },
  imagen: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginBottom: 5,
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 15,
    marginLeft: 15
  },
  container: {
    flex: 1,
    padding: 16,
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
  exchangeArrow: {
    width: 60,
    height: 50,
    marginHorizontal: 8
  },
  exchangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingBottom: 16,
  },
  leftContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    margin: 5,
  },
  rightContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    margin: 5,
  },
});
