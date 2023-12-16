// In src/components/navigation/ServiceStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../../screens/HomeScreen';
import ServiceProvidersScreen from '../../screens/ServiceProvidersScreen';
import ServiceProviderDetailsScreen from '../../screens/ServiceProviderDetailsScreen';


import AddAddressPage from '../../screens/addAddressScreen'; // Adjust the import path

// import ServiceProviderDetailsScreen from '../../screens/ServiceProviderDetailsScreen'; // Import your ServiceProviderDetailsScreen

const Stack = createStackNavigator();

const ServiceStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ServiceProviders" component={ServiceProvidersScreen} />
      <Stack.Screen name="AddAddress" component={AddAddressPage} />
        <Stack.Screen name="ServiceProviderDetails" component={ServiceProviderDetailsScreen} />

      {/* <Stack.Screen name="ServiceProviderDetails" component={ServiceProviderDetailsScreen} /> */}
    
    </Stack.Navigator>
  );
};

export default ServiceStack;
