// SACAR LA DESCRIPCION Y AGREGAR "NUEVO/USADO" Y "GRATIS/INTERCAMBIO"
import React, { useRef, useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs, doc, getDoc, query, where, updateDoc } from 'firebase/firestore';
import { db, auth } from "../firebaseConfig";
import { Drawer } from "react-native-paper";

export default function Concretarinfo() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [intercambios, setIntercambios] = useState([]);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, [navigation]);

  const goMiPerfil = () => {
    navigation.navigate("MiPerfil");
  };
  const goGaleria = () => {
    navigation.navigate("Galeria2");
  };
  const goMisPublicados = () => {
    navigation.navigate("MisPublicados");
  };
  const goMisOfertas = () => {
    navigation.navigate("MisOfertas");
  };
  
  const goToDatosCambio = (ofertaEspecifica) => {
    if (ofertaEspecifica?.UsuarioOferta?.uid) {
      const itemParaPasar = {
        ArticuloGaleria: ofertaEspecifica.ArticuloGaleria,
        ArticuloOferta: ofertaEspecifica.ArticuloOferta,
        UsuarioOfertaUid: ofertaEspecifica.UsuarioOferta.uid,
        nombreArticuloGaleria: ofertaEspecifica.nombreArticuloGaleria,
        nombreArticuloOferta: ofertaEspecifica.nombreArticuloOferta
      };
      navigation.navigate('DatosCambio', { item: itemParaPasar, modo: 'telocambio', fromConcretarInfo: true });
    } else {
      console.error('Datos de oferta específica o ID de UsuarioOferta no disponibles', ofertaEspecifica);
    }
  };  

  useEffect(() => {
    const fetchIntercambios = async () => {
      setIsLoading(true);
      try {
        const offersRef = query(
          collection(db, 'Ofertas'),
          where('UsuarioGaleria', '==', auth.currentUser.uid),
          where('Estado', '==', 'completado') // Asumiendo que buscamos ofertas completadas en ConcretarInfo.js
        );
        const offersSnap = await getDocs(offersRef);
        const fetchedIntercambios = [];
  
        for (let offerDoc of offersSnap.docs) {
          const ofertaData = offerDoc.data();
          const publicacionGaleriaRef = doc(db, 'Publicaciones', ofertaData.ArticuloGaleria);
          const publicacionOfertaRef = doc(db, 'Publicaciones', ofertaData.ArticuloOferta);
          const [publicacionGaleriaSnap, publicacionOfertaSnap] = await Promise.all([
            getDoc(publicacionGaleriaRef),
            getDoc(publicacionOfertaRef),
          ]);
          const userGaleriaQuery = query(collection(db, 'Usuarios'), where('uid', '==', ofertaData.UsuarioGaleria));
          const userOfertaQuery = query(collection(db, 'Usuarios'), where('uid', '==', ofertaData.UsuarioOferta));
          const [userGaleriaSnapshot, userOfertaSnapshot] = await Promise.all([
            getDocs(userGaleriaQuery),
            getDocs(userOfertaQuery),
          ]);
          const userGaleriaData = !userGaleriaSnapshot.empty ? userGaleriaSnapshot.docs[0].data() : null;
          const userOfertaData = !userOfertaSnapshot.empty ? userOfertaSnapshot.docs[0].data() : null;
  
          fetchedIntercambios.push({
            nombreArticuloGaleria: publicacionGaleriaSnap.data()?.nombreArticulo,
            nombreArticuloOferta: publicacionOfertaSnap.data()?.nombreArticulo,
            idsPublicaciones: [ofertaData.ArticuloGaleria, ofertaData.ArticuloOferta],
            id: offerDoc.id,
            fecha: ofertaData.fecha,
            ArticuloGaleria: publicacionGaleriaSnap.data(),
            ArticuloOferta: publicacionOfertaSnap.data(),
            UsuarioGaleria: {
              imagenen: userGaleriaData && userGaleriaData.imagenen.length > 0 ? userGaleriaData.imagenen[0] : null,
              nombre_apellido: userGaleriaData ? userGaleriaData.nombre_apellido : null,
            },
            UsuarioOferta: {
              uid: userOfertaData?.uid,
              imagenen: userOfertaData && userOfertaData.imagenen.length > 0 ? userOfertaData.imagenen[0] : null,
              nombre_apellido: userOfertaData ? userOfertaData.nombre_apellido : null,
            },
          });
        }
        setIntercambios(fetchedIntercambios);
      } catch (error) {
        console.error("Error al obtener intercambios:", error);
      }
      setIsLoading(false);
    };
    fetchIntercambios();
  }, []);
  
  

  const drawer = useRef(null);
  const [drawerPosition] = useState("left");

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
    </View>
  );

  return (
    <DrawerLayout
      ref={drawer}
      drawerWidth={300}
      drawerPosition={drawerPosition}
      renderNavigationView={navigationView}
    >
      <View style={styles.container}>
        <Text style={{ ...styles.bigText, ...styles.boldTextTittle }}>
          Objetos de Intercambio
        </Text>
  
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          intercambios.map((intercambio) => (
            <View key={intercambio.id} style={styles.itemContainer}>
              <Text style={styles.boldTextTittle}>Mis artículos</Text>
              <View style={styles.item}>
                <Image source={{ uri: intercambio.ArticuloGaleria.imagenURL }} style={styles.imagen} />
                <View style={styles.detallesContainer}>
                  <Text style={styles.text}>Nombre: {intercambio.ArticuloGaleria.nombreArticulo}</Text>
                  <Text style={styles.text}>Estado: {intercambio.ArticuloGaleria.estadoArticulo}</Text>
                  <Text style={styles.text}>Tipo: {intercambio.ArticuloGaleria.tipo}</Text>
                </View>
                <Image source={{ uri: intercambio.UsuarioGaleria.imagenen }} style={styles.fotoPerfil} />
              </View>
              <Text style={styles.boldTextTittle}>
                Artículo de "{intercambio.UsuarioOferta.nombre_apellido}"
              </Text>
              <View style={styles.item}>
                <Image source={{ uri: intercambio.ArticuloOferta.imagenURL }} style={styles.imagen} />
                <View style={styles.detallesContainer}>
                  <Text style={styles.text}>Nombre: {intercambio.ArticuloOferta.nombreArticulo}</Text>
                  <Text style={styles.text}>Estado: {intercambio.ArticuloOferta.estadoArticulo}</Text>
                  <Text style={styles.text}>Tipo: {intercambio.ArticuloOferta.tipo}</Text>
                </View>
                <Image source={{ uri: intercambio.UsuarioOferta.imagenen }} style={styles.fotoPerfil} />
              </View>
              <TouchableOpacity
                style={styles.buttonRechazar}
                onPress={() => goToDatosCambio(intercambio)}
              >
                <Text style={styles.buttonText}>Información del usuario</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </DrawerLayout>
  );
  
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
  itemContainer: {
    width: "90%",
    alignItems: "center",
  },
  item: {
    width: "100%",
    backgroundColor: "#8AAD34",
    borderRadius: 7,
    padding: 10,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  boldText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  boldTextTittle: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  bigText: {
    fontSize: 24,
    paddingBottom: 60,
  },
  espacioContainer: {
    marginTop: 20,
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
  buttonAceptar: {
    marginTop: 15,
    backgroundColor: "#8AAD34",
    borderRadius: 5,
    width: 200,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonRechazar: {
    marginTop: 15,
    backgroundColor: "#cc0000",
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
    fontWeight: "500",
    color: "#ffffff",
    padding: 12,
  },
  separatorLine: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginVertical: 10,
  },
  logo: {
    width: 260,
    height: 47,
  },
  imagen: {
    width: 100,
    height: 100,
  },
  detallesContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#8AAD34",
    borderRadius: 7,
    marginVertical: 10,
  },
  fotoPerfil: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
