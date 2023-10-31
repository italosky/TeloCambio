import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { Card } from 'react-native-paper';
import React from 'react';
import { useNavigation } from "@react-navigation/native";

const MisListItem = ({item}) => {
  const navigation = useNavigation();
  const goDetalleArticulo = () => {
    // Navega a la pantalla 'DetalleArticulo'
    navigation.navigate('DetalleArticulo', { itemId: item.id });
  };
  const goCategoria = () => {
    // Navega a la pantalla 'DetalleArticulo'
    navigation.navigate('Categoria', { itemId: item.id });
  };
  return (
    <Card style={styles.containerCard} onPress={goDetalleArticulo}> 
      <Card.Title
      style={styles.containerCardContent} 
      title={<Text style={styles.textCard} >{item.nombre}</Text>} 
      subtitle={<Text style={styles.textCardDate} >Publicado el {item.fecha}</Text>}
      left={(props) => <Image source={item.imagen} style={styles.imagen}/>}
      right={(props) => <Image source={require("../../assets/Eliminar.png")} style={styles.icon}/>}
      />
    </Card>
  );
};

export default MisListItem;

const styles = StyleSheet.create({
  viewCard: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonCard: {
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    padding: 5,
    backgroundColor: "#63A355",
  },
  textButton: {
    color: "#ffffff",
  },
});