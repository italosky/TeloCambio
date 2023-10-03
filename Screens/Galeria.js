import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated
} from "react-native";
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { useNavigation, createAppContainer } from "@react-navigation/native";
import { products } from "./common/Articulos";
import { FlatList } from "react-native-gesture-handler";
import MyProductItem from "./common/MyProductItem";
import { Drawer, AnimatedFAB } from "react-native-paper";
import { auth} from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const navigation = useNavigation();
  const cerrarSesion = async () => {
    try {
      await auth.signOut(); 
      await AsyncStorage.removeItem("isLoggedIn");
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
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

  const goGaleria = () => {
    navigation.navigate("Galeria");
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

  const navigationView = () => (
    <View style={[styles.containerDrawer, styles.navigationContainer]}>
      {/* Título "TeloCambio" encima de la línea superior, mi opcion B era dejarlo como texto */}
      <View>
        <Image
          source={require("../assets/LogoTeLoCambio.png")}
          style={styles.logo}
        />
      </View>

      {/* Línea de separación */}
      <View style={styles.separatorLine} />

      <Drawer.Section>
        <TouchableOpacity style={styles.drawerItem} onPress={goMiPerfil}>
          <Text style={styles.drawerText}>Mi Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem} onPress={goGaleria}>
          <Text style={styles.drawerText}>Galeria de Artículos</Text>
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
    source={require('../assets/Salir.png')}
    style={styles.logoutImage}
  />
</TouchableOpacity>
    </View>
  );

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

  const [isExtended, setIsExtended] = React.useState(true);

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  const renderDrawerAndroid = () => (
    <DrawerLayout
      ref={drawer}
      drawerWidth={300}
      drawerPosition='left'
      renderNavigationView={navigationView}
    >
      <ScrollView>
        <View style={{ marginTop: 15 }}>
          <FlatList
            data={categoryList}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity style={styles.HorizontalScroll}>
                  <Text style={styles.textButton}>{item.category}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {categoryList.map((category) => (
          <View key={category.category}>
            <Text style={styles.titleCategory}>{category.category}</Text>
            <View style={{ marginTop: 15 }}>
              <FlatList
                data={category.data}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => {
                  return <MyProductItem item={item} />;
                }}
              />
            </View>
          </View>
        ))}
      </ScrollView>
      <AnimatedFAB
        icon={"plus"}
        label={"Subir Artículo     "}
        extended={isExtended}
        onPress={goSubirArticulos}
        visible={true}
        animateFrom={"right"}
        iconMode={"static"}
        style={[styles.fabStyle]}
        color="white"
      />
    </DrawerLayout>
  );

  return Platform.OS === "ios" ? renderDrawerAndroid() : renderDrawerAndroid();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  HorizontalScroll: {
    padding: 10,
    marginLeft: 15,
    borderRadius: 20,
    backgroundColor: "#A5CB48",
    opacity: 30,
  },
  titleCategory: {
    marginTop: 20,
    marginLeft: 20,
    color: "#000",
    fontSize: 20,
    fontWeight: "600",
  },
  textButton: {
    color: "#ffffff",
    fontWeight: "500",
  },
  containerDrawer: {
    flex: 1,
    padding: 16,
  },
  navigationContainer: {
    backgroundColor: "#ecf0f1",
  },
  paragraph: {
    padding: 16,
    fontSize: 15,
    textAlign: "center",
  },
  drawerItem: {
    backgroundColor: "#8AAD34",
    margin: 10,
    borderRadius: 30,
  },
  drawerItemEnd: {
    backgroundColor: "#8AAD34",
    margin: 10,
    borderRadius: 30,
    marginVertical: 10,
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
    bottom: 20,
    right: 20,
    position: "absolute",
    backgroundColor: "#A5CB48",
  },
  logoutButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  
  logoutImage: {
    width: 100,
    height: 100,
  },
});
