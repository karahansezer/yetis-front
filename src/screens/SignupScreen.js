import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,TouchableWithoutFeedback, Keyboard   } from 'react-native';
import { signupUser } from '../api/authService'; // import the signup function

const SignUpScreen = ({ navigation }) => {
    const [userInfo, setUserInfo] = useState({
        fullName: '',
        phone: '',
        email: '',
        password: '',
    });

    const handleSignup = async () => {
        try {
            const data = await signupUser(userInfo);
            Alert.alert('Signup Successful', 'You have successfully signed up.');
            navigation.navigate('SignIn'); // navigate to Signin page after successful signup
        } catch (error) {
            Alert.alert('Signup Failed', error.message);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
            <Text style={styles.title}>SIGN UP</Text> 
            <TextInput
                placeholder="Full Name"
                placeholderTextColor="#616983" // Set placeholder text color here
                value={userInfo.fullName}
                onChangeText={(value) => setUserInfo({ ...userInfo, fullName: value })}
                style={styles.input}
            />
            <TextInput
                placeholder="Email"
                placeholderTextColor="#616983" // Set placeholder text color here
                value={userInfo.email}
                onChangeText={(value) => setUserInfo({ ...userInfo, email: value })}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Phone Number"
                placeholderTextColor="#616983" // Set placeholder text color here
                value={userInfo.phone}
                onChangeText={(value) => setUserInfo({ ...userInfo, phone: value })}
                style={styles.input}
                keyboardType="phone-pad"
            />
            <TextInput
                placeholder="Password"
                placeholderTextColor="#616983" // Set placeholder text color here
                value={userInfo.password}
                onChangeText={(value) => setUserInfo({ ...userInfo, password: value })}
                secureTextEntry
                style={styles.input}
            />
            <TouchableOpacity onPress={handleSignup} style={styles.button}>
                <Text style={styles.buttonText}>SIGN UP</Text>
            </TouchableOpacity>
            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                    <Text style={styles.loginButton}>Sign In</Text>
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
  loginContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 15,
    },
    loginText: {
      marginRight: 10,
      fontSize: 16,
      color: '#708DA1', // Light grey for less emphasis
    },
    loginButton: {
      color: '#708DA1', // Slightly off-white color for the button text
      fontSize: 16,
      fontWeight: '600',
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
    textAlign: 'center', // Ensure text is centered within the button
  },
});
  

export default SignUpScreen;
