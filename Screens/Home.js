import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Ingreso");
    }, 3000);

    return () => clearTimeout(timer); 

  }, [navigation]);
  return (
    
    <View style={styles.container}>
      <View>
          <Image
            source={require("../assets/LogoTeLoCambio.png")}
            style={styles.logo}
          />
        </View>
      <Text style={styles.title}>Bienvenido/a!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
  },
  logo: {
    width: 350,
    height: 160,
    marginBottom : 50,
  },
});
