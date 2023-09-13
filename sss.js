import React from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { appFirebase } from "../firebaseConfig";
import googleIcon from '../assets/GoogleButton.png';
import { GoogleAuthProvider, getAuth, signInWithCredential } from "firebase/auth";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrower from "expo-web-browser";

const GOOGLE_CLIENT_IDS = {
  android: '844204413625-mvr1qkgr2rptvdaamhgjm78g1mtu010m.apps.googleusercontent.com',
  ios: '844204413625-tt508oeepjcqtau5jafb2h0a7a3gvqfg.apps.googleusercontent.com',
  web: '844204413625-jtlo2re6ca7h1jss9fdek0bn2tom985r.apps.googleusercontent.com',
};

WebBrower.maybeCompleteAuthSession();

export default function Ingreso() {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = React.useState();
  const currentPlatform = Platform.OS;
  const clientId = GOOGLE_CLIENT_IDS[currentPlatform] || GOOGLE_CLIENT_IDS.web;

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId,
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      const auth = getAuth(appFirebase);
      signInWithCredential(auth, credential)
        .then(() => {
          console.log("Usuario autenticado con Firebase!");
        })
        .catch((error) => {
          console.error("Error al autenticar con Firebase:", error);
        });
    }
  }, [response]);

  

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,
    });
  }, [navigation]);

  const goLogin = () => {
    navigation.navigate("Login");
  };

  const goRegistro = () => {
    navigation.navigate("Registro");
  };