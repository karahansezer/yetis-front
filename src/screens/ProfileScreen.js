import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';

const ProfileScreen = () => {
  const { signOut } = useContext(AuthContext);

  const handleSignOut = async () => {
    try {
      await signOut();
      Alert.alert('Sign Out', 'You have been signed out successfully.');
    } catch (error) {
      Alert.alert('Sign Out Failed', 'An error occurred while trying to sign out.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    marginTop: 20,
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  }
});

export default ProfileScreen;
