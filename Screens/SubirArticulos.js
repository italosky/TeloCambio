import React, { useEffect, useState } from 'react';
import { Button, Platform, StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

export default function Home(){
    const navigation = useNavigation();

    const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.containerImage}>
        <Card>
          {image && <Image source={{ uri: image }} style={styles.image} />}
        </Card>
        <TouchableOpacity style={styles.cajaBoton} onPress={pickImage}>
          <Text style={styles.textoBoton}>Seleccionar Imagen</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.containerTextInput}>
        <Text style={styles.title}>Nombre del Artículo</Text>
        <View style={styles.cajaTexto}>
            <TextInput placeholder="Ej. Bicicleta" style={styles.textInput}/>
        </View>
      
        <Text style={styles.title}>Estado del Artículo</Text>
        <View style={styles.cajaTexto}>
            <TextInput placeholder="Nuevo/Usado" style={styles.textInput}/>
        </View>
      
        <Text style={styles.title}>Intercambio o Gratis</Text>
        <View style={styles.cajaTexto}>
            <TextInput placeholder="Intercambio o Gratis" style={styles.textInput}/>
        </View>
      
        <TouchableOpacity style={styles.cajaBotonP}>
          <Text style={styles.textoBotonP}>Publicar</Text>
        </TouchableOpacity>
      </View>
    
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  containerGaleria: {
    alignItems: "center",
    paddingVertical: 15,
  },

  title: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "white",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
  },
  containerImage: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 15,
    margin: 10,
  },
  containerTextInput: {
    marginTop: 15,
    alignItems: "center",
    paddingVertical: 20,
  },
  cajaBoton: {
    backgroundColor: "#ffffff",
    borderRadius: 30,
    paddingVertical: 15,
    width: 250,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#8AAD34",
  },
  textoBoton:{
    textAlign: "center",
    color: "#8AAD34",
  },
  cajaTexto: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: "#cccccc50",
    borderRadius: 30,
    marginVertical: 7,
  },
  textInput: {
    paddingHorizontal: 15,
    color: "#a9a9a9",
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    paddingVertical: 15,
    alignItems: "center",
    textAlign: "center",
  },
  cajaBotonP: {
    backgroundColor: "#8AAD34",
    borderRadius: 30,
    paddingVertical: 15,
    width: 150,
    marginTop: 30,
    alignItems: "center",
  },
  textoBotonP:{
    textAlign: "center",
    color: "#ffffff",
    fontSize: 18,
    fontWeight: '500',
  },
  card: {
    margin: 10,
  },
  image: {
    width: 150, 
    height: 150,
    paddingVertical: 15,
    paddingHorizontal: 15,
    margin: 15,
  },
});

