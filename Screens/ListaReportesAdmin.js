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
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function ListaReportesAdmin() {
  const navigation = useNavigation();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [numColumns, setNumColumns] = useState(2);
  const formatDateFromDatabase = (date) => {
    if (!date) return '';  // Verifica si date está definido
    return getCurrentDateFormatted(date);
  };
  
  const getCurrentDateFormatted = (date) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const allItemsArray = [];
      const articulosPublicadosRef = collection(db, "Reportes");
      const usersSnapshot = await getDocs(articulosPublicadosRef);
      usersSnapshot.forEach((postDoc) => {
        const postData = postDoc.data();
        allItemsArray.push({
          id: postDoc.id,
          imagenes: postData.imagenes,
          nombreArticulo: postData.nombreArticulo,
          fecha: postData.timestamp.toDate(),
          estado: postData.estadoArticulo,
          comuna: postData.comuna,
          causaReporte: postData.causa_reporte,
          detalleReporte: postData.reporte,
          publicacionId:postData.publicacionId 
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
    fetchPosts();
    return unsubscribe;
  }, [navigation]);
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null, 
      gestureEnabled: false, 
    });
  }, [navigation]);



  const renderItem = ({item}) => {
    const navigateToPublicacionReportada = () => {
      navigation.navigate("PublicacionReportada", {
        ...item,
        fechaReporte: formatDateFromDatabase(item.fecha),
        
      });
    };
    return (
      <Card style={styles.containerCard} onPress={navigateToPublicacionReportada}>
        <Card.Title
        style={styles.containerCardContent} 
        title={<Text style={styles.textCard} >{item.nombreArticulo}</Text>} 
        subtitle={<Text style={styles.textCardDate}>Reportado el {formatDateFromDatabase(item.fecha)}</Text>}
        left={(props) => <Image source={{ uri: item.imagenes[0] }} style={styles.imagenList} />}
        />
      </Card>
  
    );
  };

  return (
    <View style={{ marginTop: 15 }}>
      <FlatList
        data={dataSource} 
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.gridContainer}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
    </View>
  );
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
  logo: {
    width:260,
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
