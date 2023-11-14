// SACAR LA DESCRIPCION Y AGREGAR "NUEVO/USADO" Y "GRATIS/INTERCAMBIO"
import React, { useRef, useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs, doc, getDoc, query, where, updateDoc } from 'firebase/firestore';
import { Drawer } from "react-native-paper";
import { db, auth } from "../firebaseConfig";

export default function Concretar() {
  const [ofertas, setOfertas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modo, setModo] = useState('telocambio'); // o 'teloregalo' según corresponda
  const [idsPublicaciones, setIdsPublicaciones] = useState([]);
  const navigation = useNavigation();
  React.useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, [navigation]); 

  useEffect(() => {
    const fetchOfertas = async () => {
      setIsLoading(true);
      try {
        const offersRef = query(
          collection(db, 'Ofertas'),
          where('UsuarioGaleria', '==', auth.currentUser.uid),
          where('Estado', '==', 'pendiente')
        );
        const offersSnap = await getDocs(offersRef);
        const fetchedOfertas = [];
        const idsTemporales = [];
        for (let offerDoc of offersSnap.docs) {
          const ofertaData = offerDoc.data();
          idsTemporales.push(ofertaData.ArticuloGaleria);
          idsTemporales.push(ofertaData.ArticuloOferta);
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
          const nombreArticuloGaleria = publicacionGaleriaSnap.data()?.nombreArticulo;
          const nombreArticuloOferta = publicacionOfertaSnap.data()?.nombreArticulo;
          fetchedOfertas.push({
            nombreArticuloGaleria,
            nombreArticuloOferta,
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
        setIdsPublicaciones(idsTemporales);
        setOfertas(fetchedOfertas);
      } catch (error) {
        console.error("Error al obtener ofertas:", error);
      }
      setIsLoading(false);
    };
    fetchOfertas();
  }, []);

  // ---------------  AQUI CAMBIA EL ESTADO DE LA OFERTA A COMPLETADA ----------------
  const actualizarEstadoOferta = async (ofertaId) => {
    const ofertaRef = doc(db, 'Ofertas', ofertaId);
    try {
      await updateDoc(ofertaRef, {
        Estado: 'completado',
      });
      console.log('Oferta actualizada a completado')
    } catch (error) {
      console.error('Error al actualizar la oferta:', error);
    }
  };

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

  const goToDatosCambio = (ofertaEspecifica, modo) => {
    if (ofertaEspecifica?.UsuarioOferta?.uid) {
      const itemParaPasar = {
        ArticuloGaleria: ofertaEspecifica.ArticuloGaleria,
        ArticuloOferta: ofertaEspecifica.ArticuloOferta,
        UsuarioOfertaUid: ofertaEspecifica.UsuarioOferta.uid,
        nombreArticuloGaleria: ofertaEspecifica.nombreArticuloGaleria,
        nombreArticuloOferta: ofertaEspecifica.nombreArticuloOferta
      };
      navigation.navigate('DatosCambio', { item: itemParaPasar, modo: modo });
    } else {
      console.error('Datos de oferta específica o ID de UsuarioOferta no disponibles', ofertaEspecifica);
    }
  };
  
  const manejarAceptarOferta = async (ofertaEspecifica) => {
    if (modo === 'telocambio' && ofertaEspecifica) {
      await actualizarEstadoOferta(ofertaEspecifica.id);
      if (idsPublicaciones.length >= 2) {
        const idPublicacion1 = idsPublicaciones[0];
        const idPublicacion2 = idsPublicaciones[1];
        await actualizarEstadoPublicaciones(idPublicacion1, idPublicacion2);
      } else {
        console.error('No hay suficientes IDs de publicación disponibles');
      }
      goToDatosCambio(ofertaEspecifica, 'telocambio');
    } else {
      console.error('Oferta específica no definida o modo no es telocambio');
    }
  };
  
  // --------------- AQUI CAMBIA EL ESTADO DE ACTIVA A INACTIVA LAS PUBLICACIONES, POR ENDE NO SE VEN EN NINGUN LADO ---------------
  const actualizarEstadoPublicaciones = async () => {
    try {
      const updates = idsPublicaciones.map(id => 
        updateDoc(doc(db, 'Publicaciones', id), { estadoPublicacion: 'inactiva' })
      );
      await Promise.all(updates);
      console.log('Estados de publicaciones actualizados a inactiva');
    } catch (error) {
      console.error('Error al actualizar las publicaciones: ', error);
    }
  };

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
        {ofertas.map((oferta, index) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.boldTextTittle}>Mi artículo</Text>
            <View style={styles.item}>
              {oferta.ArticuloGaleria.imagenURL && (
                <Image source={{ uri: oferta.ArticuloGaleria.imagenURL }} style={styles.imagen} />
              )}
              <View style={styles.detallesContainer}>
                <Text style={styles.text}>
                  {oferta.ArticuloGaleria.nombreArticulo}
                </Text>
                <Text style={styles.text}>
                  {oferta.ArticuloGaleria.estadoArticulo}
                </Text>
                <Text style={styles.text}>
                  {oferta.ArticuloGaleria.tipo}
                </Text>
              </View>
              {oferta.UsuarioGaleria.imagenen && (
                <Image source={{ uri: oferta.UsuarioGaleria.imagenen }} style={styles.fotoPerfil} />
              )}
            </View>
            <Text style={styles.boldTextTittle}>
              Artículo de {oferta.UsuarioOferta.nombre_apellido || 'Usuario desconocido'}
            </Text>
            <View style={styles.item}>
              {oferta.ArticuloOferta.imagenURL && (
                <Image source={{ uri: oferta.ArticuloOferta.imagenURL }} style={styles.imagen} />
              )}
              <View style={styles.detallesContainer}>
                <Text style={styles.text}>
                  {oferta.ArticuloOferta.nombreArticulo}
                </Text>
                <Text style={styles.text}>
                  {oferta.ArticuloOferta.estadoArticulo}
                </Text>
                <Text style={styles.text}>
                  {oferta.ArticuloOferta.tipo}
                </Text>
              </View>
              {oferta.UsuarioOferta.imagenen && (
                <Image source={{ uri: oferta.UsuarioOferta.imagenen }} style={styles.fotoPerfil} />
              )}
            </View>
            <TouchableOpacity
              style={styles.buttonAceptar}
              onPress={() => manejarAceptarOferta(oferta)}
            >
              <Text style={styles.buttonText}>Aceptar Oferta</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.buttonRechazar}
              onPress={() => manejarAceptarOferta(oferta)}
              >
              <Text style={styles.buttonText}>Rechazar Oferta</Text>
            </TouchableOpacity>
          </View>
        ))}
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
