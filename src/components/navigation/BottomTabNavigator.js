// In src/components/navigation/BottomTabNavigator.js
import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../../contexts/AuthContext';
import ProfileScreen from '../../screens/ProfileScreen';
import ProviderHomeScreen from '../../screens/ProviderHomeScreen';
import AppointmentsScreen from '../../screens/AppointmentsScreen';
import ServiceStack from './ServiceStack'; // Import ServiceStack

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const { userType } = useContext(AuthContext);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      {userType === 'provider' ? (
        <Tab.Screen name="ProviderHome" component={ProviderHomeScreen} />
      ) : (
        // Use ServiceStack for the Home tab
        <Tab.Screen name="Home" component={ServiceStack} />
      )}
      <Tab.Screen name="Appointments" component={AppointmentsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
