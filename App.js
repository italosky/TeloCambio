import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';

import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer, lovigationContainer} from "@react-navigation/native";
import Login from './Screens/Login';
import Home from './Screens/Home';

export default function App() {

  const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login}
      options={{
        title:"Login",
        headerTintColor:"white",
        headerTitleAlign:"center",
        headerStyle:{backgroundColor:"#525FE1"},
      }} />
      <Stack.Screen name="Home" component={Home}
      options={{
        title:"Home",
        headerTintColor:"white",
        headerTitleAlign:"center",
        headerStyle:{backgroundColor:"#525FE1"},
      }} />
    </Stack.Navigator>
  );
}

  return (
    <NavigationContainer>
      <MyStack/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
