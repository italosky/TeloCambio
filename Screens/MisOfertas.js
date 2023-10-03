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
import { useNavigation } from "@react-navigation/native";
import { products } from "./common/Articulos";
import { FlatList } from "react-native-gesture-handler";
import MisPublicadosItem from "./common/MisPublicadosItem";
import { Drawer } from "react-native-paper";

export default function MisOfertas() {
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

  const goGaleria = () => {
    navigation.navigate("Galeria");
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

        <TouchableOpacity style={styles.drawerItemEnd} onPress={goMisOfertas}>
          <Text style={styles.drawerText}>Mis Ofertas</Text>
        </TouchableOpacity>
      </Drawer.Section>

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

  const renderDrawerAndroid = () => (
    <DrawerLayout
      ref={drawer}
      drawerWidth={300}
      drawerPosition={drawerPosition}
      renderNavigationView={navigationView}
    >
        <View style={{ marginTop: 15 }}>
          <FlatList
            data={AccesoriosList}
            renderItem={({ item, index }) => {
              return <MisPublicadosItem item={item} />;
            }}
          />
        </View>
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
    fontWeight: '500',
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
    fontSize: 15,
    fontWeight: "500",
    color: "#ffffff",
    padding: 12,
    paddingHorizontal: 20,
  },
  separatorLine: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginVertical: 10,
  },
  logo: {
    width:260,
    height: 47,
  },
});
