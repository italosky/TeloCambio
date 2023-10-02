import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Card } from 'react-native-paper';
import React from 'react';
import { useNavigation } from "@react-navigation/native";

const MyProductItem = ({item}) => {
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
      <Card.Cover source={item.imagen} style={styles.imagen}/>
      <Text style={styles.titleCard}>{item.nombre}</Text>
      <View style={styles.viewCard}>
        <Text style={styles.textCard}>{item.comuna}</Text>
        <TouchableOpacity style={styles.buttonCard} onPress={goCategoria}>
          <Text style={styles.textButton}>TeLoCambio</Text>
        </TouchableOpacity> 
      </View>
    </Card>
  );
};

export default MyProductItem;

const styles = StyleSheet.create({
  containerCard: {
    width: 200,
    height: 200,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginLeft: 20,
    marginBottom: 10,
  },
  imagen: {
    width: '100%',
    height: 130,
    borderRadius: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  titleCard: {
    marginLeft: 10,
    marginTop: 7,
    fontSize: 18,
    fontWeight: '600',
  },
  viewCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 7,
    alignItems: 'center',
  },
  textCard: {
    fontSize: 14,
    fontWeight: '500',
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