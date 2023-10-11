import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import "react-native-gesture-handler";

import { createStackNavigator } from "@react-navigation/stack";
import {
  NavigationContainer,
  lovigationContainer,
} from "@react-navigation/native";
import Login from "./Screens/Login";
import Home from "./Screens/Home";
import Ingreso from "./Screens/Ingreso";
import Registro from "./Screens/Registro";
import Galeria2 from "./Screens/Galeria2";
import SubirArticulos from "./Screens/SubirArticulos";
import Concretar from "./Screens/Concretar";
import DatosCambio from "./Screens/DatosCambio";
import MiPerfil from "./Screens/MiPerfil";
import MisOfertas from "./Screens/MisOfertas";
import MisPublicados from "./Screens/MisPublicados";
import ReporteUsuario from "./Screens/ReporteUsuario";
import RecuperarContraseña from "./Screens/RecuperarContraseña";
import DetalleArticulo from "./Screens/DetalleArticulo";
import ListaReportesAdmin from "./Screens/ListaReportesAdmin";
import MisIntercambios from "./Screens/MisIntercambios";
import ConcretarInfo from "./Screens/ConcretarInfo";
import PublicacionReportada from "./Screens/PublicacionReportada";

export default function App() {
  const Stack = createStackNavigator();

  function MyStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: "Bienvenido/a!",
            headerTintColor: "#ffffff",
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="Ingreso"
          component={Ingreso}
          options={{
            title: "Ingresar",
            headerTintColor: "white",
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: "Inicio de Sesión",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="Registro"
          component={Registro}
          options={{
            title: "Registro",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="Galeria2"
          component={Galeria2}
          options={{
            title: "Galería",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="SubirArticulos"
          component={SubirArticulos}
          options={{
            title: "Subir Artículos",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="Concretar"
          component={Concretar}
          options={{
            title: "Concretar intercambio",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="DatosCambio"
          component={DatosCambio}
          options={{
            title: "Datos de quien aceptaste la oferta",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="MiPerfil"
          component={MiPerfil}
          options={{
            title: "Mi perfil de usuario",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="MisOfertas"
          component={MisOfertas}
          options={{
            title: "Mis ofertas recibidas",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="MisPublicados"
          component={MisPublicados}
          options={{
            title: "Mis articulos publicados",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="ReporteUsuario"
          component={ReporteUsuario}
          options={{
            title: "Reporte Usuario",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="RecuperarContraseña"
          component={RecuperarContraseña}
          options={{
            title: "Recuperar Contraseña",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="DetalleArticulo"
          component={DetalleArticulo}
          options={{
            title: "Detalle Artículo",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="ListaReportesAdmin"
          component={ListaReportesAdmin}
          options={{
            title: "Lista de Reportes Administrador",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="MisIntercambios"
          component={MisIntercambios}
          options={{
            title: "Mis Intercambios",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="ConcretarInfo"
          component={ConcretarInfo}
          options={{
            title: "Resumen",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
        <Stack.Screen
          name="PublicacionReportada"
          component={PublicacionReportada}
          options={{
            title: "Publicacion Reportada",
            headerTintColor: "white",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#63A355" },
          }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
