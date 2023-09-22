import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  DrawerLayoutAndroid,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Drawer } from "react-native-paper";

export default function MisOfertas() {
  const navigation = useNavigation();

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
      <Drawer.Section>
        <TouchableOpacity style={styles.drawerItem}  active={active === "first"} onPress={goMiPerfil}>
          <Text style={styles.drawerText}>Mi Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem}  active={active === "first"} onPress={goGaleria}>
          <Text style={styles.drawerText}>Galeria de ArtÍculos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem}  active={active === "first"} onPress={goMisPublicados}>
          <Text style={styles.drawerText}>Mis Publicados</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItem}  active={active === "first"} onPress={goMisOfertas}>
          <Text style={styles.drawerText}>Mis Ofertas</Text>
        </TouchableOpacity>
      </Drawer.Section>
    </View>
  );

  const [active, setActive] = React.useState("");

  return (

    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      drawerPosition={drawerPosition}
      renderNavigationView={navigationView}
    >
      <View>
        <Text>Hola Mundo Guapo</Text>
      </View>
    </DrawerLayoutAndroid>

  );
}

const styles = StyleSheet.create({
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
  drawerText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#ffffff',
    padding: 12,
  },
});
