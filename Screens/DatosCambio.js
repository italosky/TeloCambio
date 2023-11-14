import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function DatosCambio({ route }) {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const item = route.params?.item;
  const modo = route.params?.modo;
  const routeParams = route.params;
  const usuarioId = routeParams?.userId;

  if (!item || !modo) {
    console.error("Parámetros necesarios no proporcionados. Recibido:", { item, modo });
    return <View><Text>Información no disponible</Text></View>;
  }
  
  const backGaleria = () => {
    navigation.navigate("Galeria2");
  };

  // --------------  ESTE ES EL USEEFFECT DE LOS ALERT PARA TELOCAMBIO Y TELOREGALO ---------------
  useEffect(() => {
    if (modo === "telocambio") {
      Alert.alert("¡Felicidades!", "Has efectuado un intercambio con éxito", [
        { text: "OK" },
      ]);
    } else if (modo === "teloregalo") {
      Alert.alert("¡Felicidades!", "Has reclamado un artículo con éxito", [
        { text: "OK" }
      ]);
    }
  }, [modo]);
  
  // --------------  ESTE ES EL USEEFFECT QUE HACE EL BACKEND DE TELOCAMBIO Y TELOREGALO ---------------
  useEffect(() => {
    const fetchUserData = async () => {
      let idParaBuscar;
      if (modo === "telocambio") {
        idParaBuscar = item.UsuarioOfertaUid;
      } else if (modo === "teloregalo") {
        idParaBuscar = item.id;
      }
      if (!idParaBuscar) {
        console.error("No se proporcionó un ID para buscar");
        return;
      }
      try {
        const usuariosCollection = collection(db, "Usuarios");
        const q = query(usuariosCollection, where("uid", "==", idParaBuscar));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUserData(userData);
        } else {
          console.error("Usuario no encontrado con el ID:", idParaBuscar);
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };
  
    fetchUserData();
  }, [item, modo, route.params]);
  
  
  const openWhatsApp = () => {
    if (userData && userData.telefono) {
      const phoneNumber = userData.telefono;
      const nombrePersona = userData.nombre_apellido;
      let message;
      if (modo === "teloregalo") {
        const nombreArticulo = item.nombreArticulo;
        message = `Hola ${nombrePersona}, quisiera obtener tu artículo '${nombreArticulo}' publicado en la aplicación TeloCambio🌱. Me gustaría que conversáramos para coordinar la entrega.`;
      } else if (modo === "telocambio") {
        const nombreArticuloOferta = item.nombreArticuloOferta || item.nombreArticulo;
        const nombreArticuloGaleria = item.nombreArticuloGaleria;
        message = `Hola ${nombrePersona}, he aceptado tu oferta de tu articulo '${nombreArticuloOferta}' por mi artículo '${nombreArticuloGaleria}' en la aplicación TeloCambio🌱. Me gustaría que conversáramos para coordinar los detalles del intercambio.`;
      }
      const whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
      Linking.openURL(whatsappURL)
        .then(() => {
          console.log("Abriendo WhatsApp con mensaje personalizado...");
        })
        .catch((error) => {
          console.log("No se pudo abrir WhatsApp: ", error);
        });
    }
  };
  
  const openGmailWithSubject = () => {
    if (userData && userData.email) {
      const email = userData.email;
      const nombrePersona = userData.nombre_apellido;
      let nombreArticulo;
      let subject;
      let message;
      if (modo === "teloregalo") {
        nombreArticulo = item.nombreArticulo;
        subject = `Solicitud Articulo ${nombreArticulo}`;
        message = `Hola ${nombrePersona}, quisiera obtener tu articulo ${nombreArticulo} publicado en la aplicación TeloCambio🌱. Me gustaría que conversáramos para coordinar la entrega.`;
      } else if (modo === "telocambio") {
        nombreArticuloOferta = item.nombreArticuloOferta || item.nombreArticulo;
        nombreArticuloGaleria = item.nombreArticuloGaleria; 
        subject = `Intercambio: ${nombreArticuloGaleria} por ${nombreArticuloOferta}`;
        message = `Hola ${nombrePersona}, he aceptado tu oferta de tu articulo '${nombreArticuloOferta}' por mi artículo '${nombreArticuloGaleria}' en la aplicación TeloCambio🌱. Me gustaría que conversáramos para coordinar los detalles del intercambio.`;
      }
      const gmailURL = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      Linking.openURL(gmailURL)
        .then(() => {
          console.log("Abriendo Gmail con asunto y mensaje predeterminados...");
        })
        .catch((error) => {
          console.log("No se pudo abrir Gmail: ", error);
        });
    }
  };

  return (
    <View style={styles.container}>
      {userData && (
        <>
          <Image style={styles.tinyLogo} source={{ uri: userData.imagenen[0] }} />
          <Text style={styles.textonormal}>Nombre del Telocambista</Text>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{userData.nombre_apellido}</Text>
          </View>    
          <View style={styles.textContainer}>
            <Text style={styles.text} onPress={openGmailWithSubject}>
              {userData.email}
            </Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text} onPress={openWhatsApp}>
              {userData.telefono}
            </Text>
          </View>
        </>
      )}
      <TouchableOpacity style={styles.cajaBotonP} onPress={backGaleria}>
        <Text style={styles.textoBotonP}>Volver a Galeria</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 50,
  },
  tinyLogo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  textContainer: {
    backgroundColor: "#8AAD34",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    width: 250,
    padding: 9,
    margin: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
    fontWeight: "400",
  },
  cajaBotonP: {
    backgroundColor: "#63A355",
    borderRadius: 30,
    paddingVertical: 15,
    width: 150,
    marginTop: 30,
    alignItems: "center",
  },
  textoBotonP: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "500",
  },
  felicitationText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 50,
  },
  textonormal: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10
  }
});
