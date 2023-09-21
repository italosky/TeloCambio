import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { products } from "./common/Articulos";
import { FlatList } from "react-native-gesture-handler";
import MyProductItem from "./common/MyProductItem";

export default function Home() {
  const navigation = useNavigation();

  const [categoryList, setcategoryList] = useState([])
  const [AccesoriosList, setAccesoriosList] = useState([])
  const [ComidatList, setComidaList] = useState([])
  const [DeportesList, setDeportesList] = useState([])
  const [FerreteríaList, setFerreteríaList] = useState([])
  const [HogarList, setHogarList] = useState([])
  const [InstrumentosList, setInstrumentosList] = useState([])
  const [JuguetesList, setJuguetesList] = useState([])
  const [LibrosList, setLibrosList] = useState([])
  
  useEffect (() => {
    console.log(products);
    let tempCategory=[];
    products.category.map(item=>{
      tempCategory.push(item);
    });
    setcategoryList (tempCategory);
    setAccesoriosList(products.category[0].data);
    setComidaList(products.category[1].data);
    setDeportesList(products.category[2].data);
    setFerreteríaList(products.category[3].data);
    setHogarList(products.category[4].data);
    setInstrumentosList(products.category[5].data);
    setJuguetesList(products.category[6].data);
    setLibrosList(products.category[7].data);
  }, []);

  return (

    <View style={styles.container}>

      <View style={{marginTop: 15}}>
        <FlatList 
          data={categoryList} 
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity style={styles.HorizontalScroll} mode="elevated">
                <Text style={styles.textButton}>{item.category}</Text>
              </TouchableOpacity>

            );
          }} 
        />
      </View>

      <Text style={styles.titleCategory}>Accesorios</Text>          
      <View style={{marginTop: 15}}>
        <FlatList 
          data={AccesoriosList} 
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => {
            return <MyProductItem item={item}/>;
          }} 
        />
      </View>
      
      <Text style={styles.titleCategory}>Comida</Text>          
      <View style={{marginTop: 15}}>
        <FlatList 
          data={ComidatList} 
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => {
            return <MyProductItem item={item}/>;
          }} 
        />
      </View>

      <Text style={styles.titleCategory}>Deportes</Text>          
      <View style={{marginTop: 15}}>
        <FlatList 
          data={DeportesList} 
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => {
            return <MyProductItem item={item}/>;
          }} 
        />
      </View>

      <Text style={styles.titleCategory}>Ferretería</Text>          
      <View style={{marginTop: 15}}>
        <FlatList 
          data={FerreteríaList} 
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => {
            return <MyProductItem item={item}/>;
          }} 
        />
      </View>

    </View>

  );
}  


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  HorizontalScroll: {
    padding: 10,
    marginLeft: 20,
    borderRadius: 20,
    backgroundColor: "#8AAD34",
    opacity: 30,
  },
  titleCategory: {
    marginTop: 20,
    marginLeft: 20,
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  textButton: {
    color: "#ffffff",
  },
});
