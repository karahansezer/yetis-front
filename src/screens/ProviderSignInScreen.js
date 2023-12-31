import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard , Image } from 'react-native';
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
            <Image 
                source={require('../../assets/logo.png')} // Path to your logo image
                style={styles.logo}
            />
            <Text style={styles.title}>PROVIDER LOG IN</Text>
            <TextInput
                placeholder="E-mail"
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
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ProviderSignUp')}>
                    <Text style={styles.registerButton}>Sign Up</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Are you a customer?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.registerButton}>Log In</Text>
            </TouchableOpacity>
        </View>
        </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Dark background for the container
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    position: 'absolute', // Positioning the logo at the top left
    top: 40, 
    left: 90,
    width: 150, // Adjust the width and height as needed
    height: 150,
    margin: 20, // Adding margin to give some space from the edge
  },
  title: {
      fontSize: 30, // Slightly larger font size
      fontWeight: 'bold', // Bold font weight
      color: '#708DA1', // Slightly off-white color for the text
      alignSelf: 'flex-start', // Align to the left
      marginLeft: 20, // Adjust the left margin as needed
      marginBottom: 30, // Increased space below the header
    },
  input: {
    width: '100%',
    paddingHorizontal: 20, // Increased horizontal padding
    paddingVertical: 15,
    borderColor: '#E0E0E0', // Darker border color
    borderWidth: 2,
    borderRadius: 10, // Rounded corners for the input
    marginBottom: 20, // Increased space between inputs
    fontSize: 16,
    backgroundColor: '#E0E0E0', // Set the background color to match the container's bg color
    color: '#708DA1', // Text color for input fields

  },
  button: {
    width: '100%',
    backgroundColor: '#708DA1', // Light purplish background color for the button
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
    color: '#708DA1', // Light grey for less emphasis
  },
  registerButton: {
    color: '#708DA1', // Slightly off-white color for the button text
    fontSize: 16,
    fontWeight: '600',
  },
});
  

export default ProviderSignIn;