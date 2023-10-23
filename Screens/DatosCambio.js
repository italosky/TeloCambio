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
import { collection, query, where, getDocs } from "firebase/firestore";

export default function DatosCambio({ route }) {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const item = route.params.item;
  const userId = item.id.match(/-(.*)/)[1];

  const backGaleria = () => {
    navigation.navigate("Galeria2");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      console.log("Fetching user data for userId:", userId);
      if (!userId) return;
      try {
        const usuariosCollection = collection(db, "Usuarios");
        const usuariosQuery = query(
          usuariosCollection,
          where("uid", "==", userId)
        );
        const usuariosSnapshot = await getDocs(usuariosQuery);
        if (!usuariosSnapshot.empty) {
          const userDataFromSnapshot = usuariosSnapshot.docs[0].data();
          setUserData(userDataFromSnapshot);
        } else {
          console.log("No se encuentra el uid");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, [userId]);
  const openWhatsApp = () => {
    if (userData && userData.telefono) {
      const phoneNumber = userData.telefono;
      const nombrePersona = userData.nombre_apellido;
      const nombreArticulo = item.nombreArticulo;
      const message = `Hola ${nombrePersona}, deseo reclamar tu artículo publicado en la aplicación TeloCambio🌱 *${nombreArticulo}*. Me gustaría que conversáramos para coordinar la entrega.`;
      const whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
        message
      )}`;
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
      const nombreArticulo = item.nombreArticulo;
      const nombrePersona = userData.nombre_apellido;
      const subject = `Solicitud Articulo ${nombreArticulo} `;
      const message = `Hola ${nombrePersona}, deseo reclamar tu articulo publicado en la aplicación TeloCambio🌱 *${nombreArticulo}* Me gustaría que conversáramos para coordinar la entrega. 
      `;
      const gmailURL = `googlegmail://co?to=${email}&subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(message)}`;
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
      <Image
        style={styles.tinyLogo}
        source={require("../assets/FotoPerfil.com.png")}
      />
      {userData && (
        <>
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
    justifyContent: "center",
    alignItems: "center",
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
});
