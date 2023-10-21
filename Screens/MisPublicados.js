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
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import MisListItem from "./common/MisListItem";
import { Drawer } from "react-native-paper";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import {  signInWithEmailAndPassword } from "firebase/auth";


export default function MisPublicados() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const navigation = useNavigation();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [numColumns, setNumColumns] = useState(2);

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
  useEffect(() => {
    const user = auth.currentUser;
    if (user) setUserId(user.uid);
  }, []);
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const allItemsArray = [];
      const articulosPublicadosRef = await getDocs(query(collection(db, "Publicaciones"), where("uid", "==", userId)));
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
  

  useEffect(() => {
    //ESTE USEEFFECT HACE QUE LA GALERIA SE REFRESQUE PARA VER EL ARTICULO RECIEN SUBIDO
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
        right={(props) => <Image source={require("../assets/Eliminar.png")} style={styles.iconList}/>}
        />
      </Card>
  
    );
  };

  const renderDrawerAndroid = () => (
    <DrawerLayout
      ref={drawer}
      drawerWidth={300}
      drawerPosition={drawerPosition}
      renderNavigationView={navigationView}
    >
        <View style={{ marginTop: 15 }}>
        <FlatList
        data={dataSource} 
        renderItem={renderItem}
        keyExtractor={(item) => (item && item.uid ? item.uid.toString() : 'defaultKey')}
        contentContainerStyle={styles.gridContainer}
        onRefresh={handleRefresh}
        refreshing={refreshing}
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
    width: 260,
    height: 47,
  },
  containerCard: {
    width: 'auto',
    height: 100,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  containerCardContent: {
    width: 'auto',
    height: 100,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  imagenList: {
    width: '200%',
    height: '200%',
    borderRadius: 10,
  },
  iconList: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  viewCard: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textCard: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 38,
  },
  textCardDate: {
    fontSize: 14,
    marginLeft: 38,
  },
  buttonCard: {
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    padding: 5,
    backgroundColor: "#63A355",
  },
  textButton2: {
    color: "#ffffff",
  },
  gridContainer: {
    padding: 0,
  },
});
