// navigation/Navigator.js

import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';
import AuthStackNavigator from './AuthStackNavigator'; // you should create an Auth stack for login, signup views
import BottomTabNavigator from './BottomTabNavigator';

function Navigator() {
  const { userToken } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {userToken ? <BottomTabNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
}

export default Navigator;
