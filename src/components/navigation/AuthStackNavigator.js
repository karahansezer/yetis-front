// navigation/AuthStackNavigator.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../../screens/SigninScreen';
import SignUpScreen from '../../screens/SignupScreen'; // assuming you have these screens
import ProviderSignInScreen from '../../screens/ProviderSignInScreen';
import ProviderSignUpScreen from '../../screens/ProviderSignUpScreen';

const Stack = createStackNavigator();

function AuthStackNavigator() {
  return (
    <Stack.Navigator
    screenOptions={{
      headerShown: false, // Hide the header
    }}>
      
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ProviderSignIn" component={ProviderSignInScreen} />
      <Stack.Screen name="ProviderSignUp" component={ProviderSignUpScreen} />
    </Stack.Navigator>
  );
}

export default AuthStackNavigator;
