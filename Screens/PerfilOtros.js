import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function Registro({item}) {
  const navigation = useNavigation();
  const goReporteUsuario = () => {
    navigation.navigate("ReporteUsuario");
  };

  const [modalArticulo, setModalArticulo] = useState(true);

  const closeModal = () => {
    setModalArticulo(false);
  };

  const [columns, setColumns] = useState(2);

  const data = [
    { id: 1, nombre: "Patines", imagen: require('../Screens/assets,articulos/Patines.png') },
    { id: 2, nombre: "Luces de Bicicleta", imagen: require('../Screens/assets,articulos/LucesBici.png') },
    { id: 3, nombre: "Lentes", imagen: require('../Screens/assets,articulos/Lentes.png') },
    { id: 4, nombre: "Patines", imagen: require('../Screens/assets,articulos/Patines.png') },
    { id: 5, nombre: "Luces de Bicicleta", imagen: require('../Screens/assets,articulos/LucesBici.png') },
    { id: 6, nombre: "Lentes", imagen: require('../Screens/assets,articulos/Lentes.png') },
    { id: 7, nombre: "Patines", imagen: require('../Screens/assets,articulos/Patines.png') },
    { id: 8, nombre: "Luces de Bicicleta", imagen: require('../Screens/assets,articulos/LucesBici.png') },
    { id: 9, nombre: "Lentes", imagen: require('../Screens/assets,articulos/Lentes.png') },
  ];

  return (
    <View style={styles.container}>
      <Image style={styles.tinyLogo} source={require('../assets/yo.png')} />
      <View>
        <Text style={styles.bigText}>Pepito</Text>
      </View>
      <View style={[styles.textContainer, styles.espacioContainer]}>
        <Text style={styles.text}>Nivel de Telocambista: 
        <Text style={styles.text}> Principiante</Text></Text>
      </View>
      <TouchableOpacity style={styles.buttonReportar} onPress={goReporteUsuario}>
        <Text style={styles.buttonText}>Reportar</Text>
      </TouchableOpacity>
    
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalArticulo}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Disponible para Intercambio</Text>
            
              <FlatList style={styles.containerFlastList}
                numColumns={columns}
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Card style={styles.containerCard}>
                    <View style={styles.containerImagen}>
                      <Card.Cover source={item.imagen} style={styles.imagen}/>
                      <Text style={styles.titleCard}>{item.nombre}</Text>
                    </View>
                    
                  </Card>
                )}
              />  
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white"
  },
  tinyLogo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  textContainer: {
    backgroundColor: "#8AAD34",
    borderWidth: 1,  
    borderColor: 'gray',  
    borderRadius: 7,
    width: 330,
    padding: 15,
    margin: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white'
  },
  bigText: {
    fontSize: 24,
  },
  espacioContainer: {
    marginTop: 70, 
  },
  buttonReportar: {
    marginTop: 15, 
    backgroundColor: "red", 
    borderRadius: 5,
    width: 200, 
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    height: 350,
    width: 300,
    borderColor: "gray",
    borderWidth: 1,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 20,
    marginBottom: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },

  containerFlastList:{
    marginBottom: 1,
  },
  containerCard: {
    width: "46%",
    height: 110,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    marginTop: 10,
  },
  containerImagen: {
    marginTop: 8,
    alignItems: "center",
  },
  imagen: {
    width: 80,
    height: "80%",
    borderRadius: 5,
  },
  titleCard: {
    fontSize: 15,
    textAlign: "center",
    paddingTop: 2,
  },
});
