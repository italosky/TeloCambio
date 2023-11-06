import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs, doc, getDoc, query, where, deleteDoc } from 'firebase/firestore';
import { FlatList } from "react-native-gesture-handler";
import { Drawer, Card } from "react-native-paper";
import { db, auth } from "../firebaseConfig";

export default function MisOfertas() {
  const navigation = useNavigation();
  const [ofertas, setOfertas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const drawer = useRef(null);
  const [drawerPosition, setDrawerPosition] = useState("left");;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        // AQUI HACE QUE MUESTRE SOLO LAS OFERTAS DEL USUARIO QUE ESTA LOGEADO
        const offersRef = query(collection(db, 'Ofertas'), where('UsuarioGaleria', '==', auth.currentUser.uid));
        const offersSnap = await getDocs(offersRef);
        
        const fetchedOfertas = [];
        for (let offerDoc of offersSnap.docs) {
          const ofertaData = offerDoc.data();
          // AQUI LLAMA A LA COLECCION Publicaciones Y OBTIENE LOS ARTICULOS SEGUN LOS UID DE OFERTAS
          const publicacionGaleriaRef = doc(db, 'Publicaciones', ofertaData.ArticuloGaleria);
          const publicacionOfertaRef = doc(db, 'Publicaciones', ofertaData.ArticuloOferta);
          const [publicacionGaleriaSnap, publicacionOfertaSnap] = await Promise.all([
            getDoc(publicacionGaleriaRef),
            getDoc(publicacionOfertaRef)
          ]);
          // AQUI YA CON LOS UID OBTENIDOS DE Publicaciones LLAMA A LA DATA DE LA OFERTA
          // ESTOS SON LOS DATOS QUE VA A MOSTRAR EN EL FRONT, SE OBTUVIERON COMPARANDO LOS UID DE Ofertas Y Publicaciones
          fetchedOfertas.push({
            id: offerDoc.id,
            fecha: ofertaData.fecha,
            ArticuloGaleria: {
              imagenURL: publicacionGaleriaSnap.data().imagenURL,
              nombreArticulo: publicacionGaleriaSnap.data().nombreArticulo
            },
            ArticuloOferta: {
              imagenURL: publicacionOfertaSnap.data().imagenURL,
              nombreArticulo: publicacionOfertaSnap.data().nombreArticulo
            }
          });
        }    
        setOfertas(fetchedOfertas);
        setIsLoading(false); 
      } catch (error) {
          console.error("Error al obtener ofertas:", error);
          setIsLoading(false);
      }
    };
    fetchOfertas();
  }, []);


  const EliminarOferta = async (oferta) => {
    Alert.alert(
        "Confirmación",
        "¿Estás seguro de eliminar la oferta?",
        [
          {
            text: "No",
            onPress: () => console.log("Eliminación cancelada"),
            style: "cancel"
          },
          {
            text: "Sí", 
            onPress: async () => {
              try {
                console.log("Dentro de eliminarOferta, ofertaId:", oferta.id);
                const offerRef = doc(db, 'Ofertas', oferta.id);
                await deleteDoc(offerRef);
                setOfertas(prevOfertas => prevOfertas.filter(item => item.id !== oferta.id));
                Alert.alert(
                  "¡Éxito!",
                  "La oferta ha sido eliminada.",
                );
              } catch (error) {
                console.error("Error al eliminar la oferta:", error);
              }
            }
          }
        ],
        { cancelable: false }
    );
  };

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>¡Ups! No tienes ofertas disponibles.</Text>
    </View>
  );

  const formatDateFromDatabase = (timestamp) => {
    if (!timestamp) return '';  // or return a default value or error message
    const date = timestamp.toDate();
    return getCurrentDateFormatted(date);
  } 

  const getCurrentDateFormatted = (date) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
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
    navigation.navigate('DetalleArticulo', { itemId: item.id });
  };

  const renderDrawerAndroid = () => (
    <DrawerLayout
      ref={drawer}
      drawerWidth={200}
      drawerPosition={drawerPosition}
      renderNavigationView={navigationView}
    >
      <View style={{ flex: 1 }}>
          {isLoading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <FlatList
              contentContainerStyle={{ flexGrow: 1 }}
              data={ofertas}
              keyExtractor={item => item.id}
              renderItem={({ item, index }) => (
                <Card style={styles.containerCard} onPress={goDetalleArticulo}>
                  <Text style={styles.textCardDate}>Oferta recibida el {formatDateFromDatabase(item.fecha)}</Text>
                  <Card.Title
                    style={styles.containerCardContent}
                    left={(props) => (
                      // DATOS DEL ARTICULO DEL USUARIO AUTENTICADO
                      <View style={styles.exchangeContainer}>
                        <View style={styles.leftContainer}>
                          
                          <Image source={{uri: item.ArticuloGaleria.imagenURL}} style={styles.imagen}/>
                          <Text style={styles.textCardOne}>{item.ArticuloGaleria.nombreArticulo}</Text>
                        </View>
                        <View>
                          <Image source={require("../assets/FlechaIntercambio.png")} style={styles.exchangeArrow}/>
                        </View>
                      </View>
                    )}
                    right={(props) => (
                      // DATOS DEL ARTICULO OFERTADO 
                      <View style={styles.exchangeContainer}>
                        <View style={styles.rightContainer}>
                          <Image source={{uri: item.ArticuloOferta.imagenURL}} style={styles.imagen}/>
                          <Text style={styles.textCard}>{item.ArticuloOferta.nombreArticulo}</Text>
                          
                        </View>
                        <TouchableOpacity onPress={() => EliminarOferta(item)}>
                          <Image source={require("../assets/Eliminar.png")} style={styles.icon}/>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                </Card>
              )}
              ListEmptyComponent={EmptyListComponent} 
            />
        )}
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
    marginTop: 10
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
    alignItems: 'center'
  },
  textCardDate: {
    fontSize: 17,
    color: 'grey',
    marginTop: 5,
    marginHorizontal: 12,
    alignSelf: "center"
  },
});
