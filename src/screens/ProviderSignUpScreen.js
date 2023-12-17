import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { registerServiceProvider } from '../api/providerAuthService.js'; // Ensure this is correctly imported from your project structure
import * as Location from 'expo-location'; // This requires expo-location to be installed

const SignUpScreen = ({ navigation }) => {
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        description: '',
        address: '',
        city: '',
        district: '',
        averagePrice: '',
        latitude: null,
        longitude: null,
    });

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setUserInfo(u => ({ ...u, latitude: location.coords.latitude, longitude: location.coords.longitude }));
        })();
    }, []);

    const handleSignup = async () => {
        try {
            const data = await registerServiceProvider(userInfo);
            Alert.alert('Signup Successful', 'You have successfully signed up.');
            navigation.navigate('SignIn');
        } catch (error) {
            Alert.alert('Signup Failed', error.message);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    <Text style={styles.title}>SIGN UP</Text>
                    <TextInput
                        placeholder="Full Name"
                        value={userInfo.name}
                        onChangeText={(value) => setUserInfo({ ...userInfo, name: value })}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Email"
                        value={userInfo.email}
                        onChangeText={(value) => setUserInfo({ ...userInfo, email: value })}
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        placeholder="Phone Number"
                        value={userInfo.phone}
                        onChangeText={(value) => setUserInfo({ ...userInfo, phone: value })}
                        style={styles.input}
                        keyboardType="phone-pad"
                    />
                    <TextInput
                        placeholder="Password"
                        value={userInfo.password}
                        onChangeText={(value) => setUserInfo({ ...userInfo, password: value })}
                        secureTextEntry
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Description"
                        value={userInfo.description}
                        onChangeText={(value) => setUserInfo({ ...userInfo, description: value })}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Address"
                        value={userInfo.address}
                        onChangeText={(value) => setUserInfo({ ...userInfo, address: value })}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="City"
                        value={userInfo.city}
                        onChangeText={(value) => setUserInfo({ ...userInfo, city: value })}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="District"
                        value={userInfo.district}
                        onChangeText={(value) => setUserInfo({ ...userInfo, district: value })}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Average Price"
                        value={userInfo.averagePrice.toString()}
                        onChangeText={(value) => setUserInfo({ ...userInfo, averagePrice: parseFloat(value) })}
                        style={styles.input}
                        keyboardType="numeric"
                    />
                    <TouchableOpacity onPress={handleSignup} style={styles.button}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                            <Text style={styles.loginButton}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
    },
    container: {
        flexGrow: 1,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#708DA1',
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginBottom: 30,
    },
    input: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderColor: '#E0E0E0',
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: '#E0E0E0',
        color: '#708DA1',
    },
    button: {
        width: '100%',
        backgroundColor: '#708DA1',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#444',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    loginContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    loginText: {
        marginRight: 10,
        fontSize: 16,
        color: '#708DA1',
    },
    loginButton: {
        color: '#708DA1',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SignUpScreen;
