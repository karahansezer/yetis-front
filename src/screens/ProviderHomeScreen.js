import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { AuthContext } from '../contexts/AuthContext'; // Ensure this path matches your project structure

const ProviderHomeScreen = () => {
  const { userInfo } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to the Provider Dashboard</Text>
        {userInfo && (
          <View>
            <Text style={styles.info}>Name: {userInfo.name}</Text>
            <Text style={styles.info}>Email: {userInfo.email}</Text>
            {/* Add more fields as needed */}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // You can change the background color
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default ProviderHomeScreen;
