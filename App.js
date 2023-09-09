import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';

import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer, lovigationContainer} from "@react-navigation/native";
import Login from './Screens/Login';
import Home from './Screens/Home';
import Ingreso from './Screens/Ingreso';
import Registro from './Screens/Registro';
import Menu from './Screens/Menu';
import Galeria from './Screens/Galeria';
import SubirArticulos from './Screens/SubirArticulos';

export default function App() {

  const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home}
      options={{
        title:"Home",
        headerTintColor:"white",
        headerTitleAlign:"center",
        headerStyle:{backgroundColor:"#63A355"},
      }} />

      <Stack.Screen name="Ingreso" component={Ingreso}
      options={{
        title:"Ingresar",
        headerTintColor:"white",
        headerTitleAlign:"center",
        headerStyle:{backgroundColor:"#63A355"},
      }} />

      <Stack.Screen name="Login" component={Login}
      options={{
        title:"Inicio de Sesión",
        headerTintColor:"white",
        headerTitleAlign:"center",
        headerStyle:{backgroundColor:"#63A355"},
      }} />
      <Stack.Screen name="Registro" component={Registro}
      options={{
        title:"Registro",
        headerTintColor:"white",
        headerTitleAlign:"center",
        headerStyle:{backgroundColor:"#63A355"},
      }} />
      <Stack.Screen name="Menu" component={Menu}
      options={{
        title:"Menú",
        headerTintColor:"white",
        headerTitleAlign:"center",
        headerStyle:{backgroundColor:"#63A355"},
      }} />
      <Stack.Screen name="Galeria" component={Galeria}
      options={{
        title:"Galería",
        headerTintColor:"white",
        headerTitleAlign:"center",
        headerStyle:{backgroundColor:"#63A355"},
      }} />
      <Stack.Screen name="SubirArticulos" component={SubirArticulos}
      options={{
        title:"Subir Artículos",
        headerTintColor:"white",
        headerTitleAlign:"center",
        headerStyle:{backgroundColor:"#63A355"},
      }} />
      
    </Stack.Navigator>
    
  );
}

  return (
    <NavigationContainer>
      <MyStack/>
    </NavigationContainer>
  );
};