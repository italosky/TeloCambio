import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Home({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 2000);

    return () => clearTimeout(timer); 
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido/a</Text>
      <Text style={styles.description}>TeloCambio</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
});
