import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';

import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer, lovigationContainer} from "@react-navigation/native";
import Login from './Screens/Login';
import Home from './Screens/Home';
import Ingreso from './Screens/Ingreso';
import Registro from './Screens/Registro';

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
        title:"Login",
        headerTintColor:"white",
        headerTitleAlign:"center",
        headerStyle:{backgroundColor:"#63A355"},
      }} />
      <Stack.Screen name="Registro" component={Registro}
      options={{
        title:"Login",
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