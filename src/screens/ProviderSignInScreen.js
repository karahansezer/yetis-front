import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loginServiceProvider } from '../api/providerAuthService.js'; // Ensure this is correctly imported from your project structure
import { AuthContext } from '../contexts/AuthContext';

const ProviderSignIn = () => {
    const { signIn } = useContext(AuthContext); // get the signIn function from the AuthContext
    const navigation = useNavigation();
    const [credentials, setCredentials] = useState({
        email: '', // changed from email to phone
        password: '',
    });

    const handleSignin = async () => {
        try {
            const response = await loginServiceProvider(credentials); // this should return an object from the backend
    
            // Check if the response contains the token
            if (response && response.token) {
                await signIn(response); // save the token string using the signIn function from the AuthContext
            } else {
                throw new Error('Token was not provided by the backend.');
            }
        } catch (error) {
            Alert.alert('Signin Failed', error.message || 'Unexpected error occurred.');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
            <Text style={styles.title}>Üye Girişi</Text>
            <TextInput
                placeholder="Phone Number"
                placeholderTextColor="#616983" // Set placeholder text color here
                value={credentials.phone}
                onChangeText={(value) => setCredentials({ ...credentials,email: value })}
                style={styles.input}
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Password"
                placeholderTextColor="#616983" // Set placeholder text color here
                value={credentials.password}
                onChangeText={(value) => setCredentials({ ...credentials, password: value })}
                secureTextEntry
                style={styles.input}
            />
            <TouchableOpacity onPress={handleSignin} style={styles.button}>
                <Text style={styles.buttonText}>Giriş Yap</Text>
            </TouchableOpacity>
            <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Üye değil misiniz?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ProviderSignUp')}>
                    <Text style={styles.registerButton}>Sign Up</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Müşteri misiniz?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.registerButton}>Giriş yapın</Text>
            </TouchableOpacity>
        </View>
        </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1A1A24', // Dark background for the container
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    title: {
        fontSize: 30, // Slightly larger font size
        fontWeight: 'bold', // Bold font weight
        color: '#f0f0f0', // Slightly off-white color for the text
        alignSelf: 'flex-start', // Align to the left
        marginLeft: 20, // Adjust the left margin as needed
        marginBottom: 30, // Increased space below the header
      },
    input: {
      width: '100%',
      paddingHorizontal: 20, // Increased horizontal padding
      paddingVertical: 15,
      borderColor: '#343434', // Darker border color
      borderWidth: 2,
      borderRadius: 10, // Rounded corners for the input
      marginBottom: 20, // Increased space between inputs
      fontSize: 16,
      backgroundColor: '#121212', // Set the background color to match the container's bg color
      color: '#f0f0f0', // Text color for input fields

    },
    button: {
      width: '100%',
      backgroundColor: '#7655FA', // Light purplish background color for the button
      padding: 15,
      borderRadius: 10, // Rounded corners for the button
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#444', // Slight border for button definition
    },
    buttonText: {
      color: '#fff',
      fontSize: 16, // Adjusted font size for consistency
      fontWeight: '600',
    },
    registerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 15,
    },
    registerText: {
      marginRight: 10,
      fontSize: 16,
      color: '#aaa', // Light grey for less emphasis
    },
    registerButton: {
      color: '#f0f0f0', // Slightly off-white color for the button text
      fontSize: 16,
      fontWeight: '600',
    },
  });
  

export default ProviderSignIn;