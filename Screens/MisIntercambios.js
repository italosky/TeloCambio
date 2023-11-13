import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { Card, Drawer } from "react-native-paper";
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs, doc, getDoc, query, where, deleteDoc } from 'firebase/firestore';
import { db, auth } from "../firebaseConfig";
import { FlatList } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MisPublicados() {
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [ofertas, setOfertas] = useState([]);
  const navigation = useNavigation();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, "Publicaciones", itemId));
      setDataSource((prevData) =>
        prevData.filter((item) => item.uid !== itemId)
      );
    } catch (error) {
      console.error("Error al eliminar el artículo:", error);
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

  const goGaleria2 = () => {
    navigation.navigate("Galeria2");
  };

  const goMisPublicados = () => {
    navigation.navigate("MisPublicados");
  };

  const goMisOfertas = () => {
    navigation.navigate("MisOfertas");
  };

  const goConcretarInfo = () => {
    navigation.navigate("ConcretarInfo");
  };
  const goDatosCambio = () => {
    navigation.navigate("DatosCambio", { item });
  };

  const MisIntercambios = () => {
    navigation.navigate("MisIntercambios");
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

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        // AQUI HACE QUE MUESTRE SOLO LAS OFERTAS DEL USUARIO QUE ESTA LOGEADO
        const offersRef = query(
          collection(db, 'Ofertas'),
          where('UsuarioGaleria', '==', auth.currentUser.uid),
          where('Estado', '==', 'completado')  // AQUI ESTA LA FUNCION QUE TRAE SOLO LOS COMPLETADOS
        );
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

  const formatDateFromDatabase = (timestamp) => {
    if (!timestamp) return '';  // or return a default value or error message
    const date = timestamp.toDate();
    return getCurrentDateFormatted(date);
  } 

  const getCurrentDateFormatted = (date) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
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
  useEffect(() => {
    const user = auth.currentUser;
    if (user) setUserId(user.uid);
  }, []);
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const allItemsArray = [];
      const articulosPublicadosRef = await getDocs(
        query(collection(db, "Publicaciones"), where("uid", "==", userId))
      );
      articulosPublicadosRef.forEach((postDoc) => {
        const postData = postDoc.data();
        allItemsArray.push({
          uid: postDoc.id,
          imagenURL: postData.imagenURL,
          nombreArticulo: postData.nombreArticulo, 
          tipo: postData.tipo,
          estadoArticulo: postData.estadoArticulo,
          comuna: postData.comuna,
        });
      });
      setDataSource(allItemsArray);
    } catch (error) {
      console.error("Error al cargar los artículos:", error);
    } finally {
      setLoading(false);
    }
  };

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>¡Ups! No tienes intercambio efectuados.</Text>
    </View>
  );


  useEffect(() => {
    //ESTE USEEFFECT HACE QUE LA GALERIA SE REFRESQUE PARA VER EL ARTICULO RECIEN SUBIDO
    const unsubscribe = navigation.addListener("focus", () => {
      fetchPosts();
    });
    if (userId) {
      fetchPosts();
    }
    return unsubscribe;
  }, [navigation, userId]);
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };
  
  const renderItem = ({ item }) => {
    return (
      <Card style={styles.containerCard} onPress={goConcretarInfo}>
        <Card.Title
          style={styles.containerCardContent}
          title={<Text style={styles.textCard}>{item.nombreArticulo}</Text>}
          subtitle={
            <Text style={styles.textCardDate}>Publicado el {item.fecha}</Text>
          }
          left={(props) => (
            <Image style={styles.imagenList} source={{ uri: item.imagenURL }} />
          )}
          right={(props) => (
            <TouchableOpacity onPress={() => handleDeleteItem(item.uid)}>
              <Image
                source={require("../assets/Eliminar.png")}
                style={styles.iconList}
              />
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
                <Card style={styles.containerCard}>
                  <Text style={styles.textCardDate}>Intercambio completado el {formatDateFromDatabase(item.fecha)}</Text>
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
                          <Image source={require("../assets/Completado.png")} style={styles.icon}/>
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
