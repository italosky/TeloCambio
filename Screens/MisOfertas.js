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
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { useNavigation, useRoute } from "@react-navigation/native";
import { products } from "./common/Articulos";
import { FlatList } from "react-native-gesture-handler";
import { Drawer, Card } from "react-native-paper";
import { db, auth } from "../firebaseConfig";

export default function MisOfertas({ route }) {
  const navigation = useNavigation();

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

  const [categoryList, setcategoryList] = useState([]);
  const [AccesoriosList, setAccesoriosList] = useState([]);
  const [ComidaList, setComidaList] = useState([]);
  const [DeportesList, setDeportesList] = useState([]);
  const [FerreteriaList, setFerreteriaList] = useState([]);
  const [HogarList, setHogarList] = useState([]);
  const [InstrumentosList, setInstrumentosList] = useState([]);
  const [JuguetesList, setJuguetesList] = useState([]);
  const [LibrosList, setLibrosList] = useState([]);

  useEffect(() => {
    console.log(products);
    let tempCategory = [];
    products.category.map((item) => {
      tempCategory.push(item);
    });
    setcategoryList(tempCategory);
    setAccesoriosList(products.category[0].data);
    setComidaList(products.category[1].data);
    setDeportesList(products.category[2].data);
    setFerreteriaList(products.category[3].data);
    setHogarList(products.category[4].data);
    setInstrumentosList(products.category[5].data);
    setJuguetesList(products.category[6].data);
    setLibrosList(products.category[7].data);
  }, []);

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
