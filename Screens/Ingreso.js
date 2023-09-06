import React, {Component} from 'react'
import { Text, StyleSheet, View, Image, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import * as Google from 'expo-auth-session/providers/google';
import firebase from 'firebase/app';
import 'firebase/auth';

export default function Ingreso(){
    const navigation = useNavigation();

    React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false, 
    });
    }, [navigation]);
    
    const goLogin=()=>{
        navigation.navigate('Login')
    }
    const goRegistro=()=>{
        navigation.navigate('Registro')
    }
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: '231713560463-0u7k5s0udlfn8qrl6h0lf544g7poeaip.apps.googleusercontent.com',
        });
        
        const signInWithGoogle = async () => {
        try {
            const result = await promptAsync();
            if (result.type === 'success') {
            const { id_token } = result.params;
        
            const googleAuth = firebase.auth;
            const credential = googleAuth.GoogleAuthProvider.credential(id_token);
            await googleAuth().signInWithCredential(credential);
            }
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <View style={styles.padre}>
            <View style={styles.padreBoton}>
                    <TouchableOpacity style={styles.cajaBotonL} onPress={goLogin}>
                        <Text style={styles.textoBoton}>Iniciar Sesión</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.padreBoton}>
                    <TouchableOpacity style={styles.cajaBotonR} onPress={goRegistro}>
                        <Text style={styles.textoBoton}>Registrarse</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.padreBoton}>
                    <TouchableOpacity style={styles.cajaBotonG} onPress={signInWithGoogle}>
                         <Text style={styles.textoBoton}>Iniciar con Google</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
    )
}

const styles = StyleSheet.create({
    padre: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    padreBoton:{
        alignItems:'center',
    },
    cajaBotonL:{
        backgroundColor:'#8AAD34',
        borderRadius:'30',
        paddingVertical:25,
        width:300,
        marginTop:35
    },
    cajaBotonR:{
        backgroundColor:'#8AAD34',
        borderRadius:'30',
        paddingVertical:25,
        width:300,
        marginTop:35
    },
    cajaBotonG:{
        backgroundColor:'#000',
        borderRadius:'30',
        paddingVertical:25,
        width:300,
        marginTop:35
    },
    textoBoton:{
        textAlign:'center',
        color:'white'
    }
})