import React, { useRef, useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { useNavigation } from "@react-navigation/native";
import { Drawer } from "react-native-paper";
import { db, auth } from "../firebaseConfig";
import { getDocs, collection, query, where } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MiPerfil() {
  const [userData, setUserData] = useState(null);
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  const navigation = useNavigation();
  
  React.useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, [navigation]);

  const goPublicaciones = () => {
    navigation.navigate("MisPublicados");
  };
  const goOfertas = () => {
    navigation.navigate("MisOfertas");
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
  const MisIntercambios = () => {
    navigation.navigate("MisIntercambios");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      console.log('Fetching user data for userId:', userId);
      if (!userId) return;
      try {
        const usuariosCollection = collection(db, 'Usuarios');
        const usuariosQuery = query(usuariosCollection, where("uid", "==", userId));
        const usuariosSnapshot = await getDocs(usuariosQuery);
        if (!usuariosSnapshot.empty) {
          const userDataFromSnapshot = usuariosSnapshot.docs[0].data();
          setUserData(userDataFromSnapshot);
        } else {
          console.log('No se encuentra el uid');
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, [userId]);

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
        <TouchableOpacity style={styles.drawerItem} onPress={MisIntercambios}>
          <Text style={styles.drawerText}>Mis Intercambios</Text>
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
      {userData && (
        <View style={styles.container}>
          {userData.imagenen && userData.imagenen[0] && (
            <Image
              style={styles.tinyLogo}
              source={{ uri: userData.imagenen[0] }}
            />
          )}
          <View>
            <Text style={styles.bigText}>{userData.nombre_apellido}</Text>
          </View>
          <View style={[styles.textContainer, styles.espacioContainer]}>
            <Text style={styles.text}>{userData.email}</Text>
          </View>
          <View style={[styles.textContainer]}>
            <Text style={styles.text}>{userData.telefono}</Text>
          </View>
        </View>
      )}
    </DrawerLayout>
  );

  return Platform.OS === "ios" ? renderDrawerAndroid() : renderDrawerAndroid();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  tinyLogo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  textContainer: {
    backgroundColor: "#8AAD34",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 7,
    width: 330,
    padding: 15,
    margin: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  bigText: {
    fontSize: 24,
  },
  espacioContainer: {
    marginTop: 40,
  },
  buttonPublicadas: {
    marginTop: 15,
    backgroundColor: "black",
    borderRadius: 5,
    width: 200,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
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
