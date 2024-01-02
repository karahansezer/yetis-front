import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  TouchableWithoutFeedback, Keyboard, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../contexts/AuthContext';
import { updateUserProfile } from '../api/userService';
import { updateServiceProviderProfile, fetchProviderById } from '../api/providerService';
import { createServiceForProvider } from '../api/servicesService';

const ProfileScreen = () => {
  const { signOut } = useContext(AuthContext);
  const [isEditable, setIsEditable] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userData, setUserData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    description: '',
    address: '',
    city: '',
    district: '',
    averagePrice: '',
    services: [],
  });
  const [newServiceName, setNewServiceName] = useState('');
  const [showAddService, setShowAddService] = useState(false);

  const firstInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      const userTypeValue = await AsyncStorage.getItem('userType');
      setUserType(userTypeValue);
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        setUserData({ ...userInfo, id: userInfo.id, services: userInfo.services || [] });

        if (userTypeValue === 'provider') {
          const providerData = await fetchProviderById(userInfo.id);
          if (providerData) {
            setUserData({ ...userData, ...providerData, services: providerData.services || [] });
          }
        }
      }
    };

    fetchUserData();
  }, []);

  const toggleEdit = () => {
    setIsEditable(!isEditable);
    if (!isEditable) {
      firstInputRef.current?.focus();
    }
  };

  const handleUpdate = async () => {
    if (!isEditable) return;

    try {
      const token = await AsyncStorage.getItem('userToken'); // Get the token for authorization
      let updatedData = {};

      if (userType === 'customer') {
        updatedData = {
          name: userData.name,
          email: userData.email,
          phone: userData.phone
        };
        await updateUserProfile(userData.id, updatedData, token);
      } else if (userType === 'provider') {
        updatedData = {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          description: userData.description,
          address: userData.address,
          city: userData.city,
          district: userData.district,
          averagePrice: parseFloat(userData.averagePrice)
        };
        await updateServiceProviderProfile(userData.id, updatedData, token);
      }

      // Update the local user data and AsyncStorage with new values
      const newUserData = { ...userData, ...updatedData };
      setUserData(newUserData);
      await AsyncStorage.setItem('userInfo', JSON.stringify(newUserData));

      setIsEditable(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleAddServiceToggle = () => {
    setShowAddService(!showAddService);
  };

  const handleAddService = async () => {
    try {
      if (!newServiceName.trim()) {
        Alert.alert('Error', 'Please enter a service name.');
        return;
      }
      const response = await createServiceForProvider(userData.id, newServiceName);
      setUserData({ ...userData, services: [...userData.services, response] });
      setNewServiceName('');
      setShowAddService(false);
      Alert.alert('Success', 'Service added successfully');
    } catch (error) {
      console.error('Error adding service:', error);
      Alert.alert('Error', 'Failed to add service');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      Alert.alert('Success', 'Signed out successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Profile</Text>
          <TextInput
            ref={firstInputRef}
            style={styles.input}
            value={userData.name}
            onChangeText={(text) => setUserData({ ...userData, name: text })}
            editable={isEditable}
            placeholder="Name"
          />
          <TextInput
            style={styles.input}
            value={userData.email}
            onChangeText={(text) => setUserData({ ...userData, email: text })}
            editable={isEditable}
            keyboardType="email-address"
            placeholder="Email"
          />
          <TextInput
            style={styles.input}
            value={userData.phone}
            onChangeText={(text) => setUserData({ ...userData, phone: text })}
            editable={isEditable}
            keyboardType="phone-pad"
            placeholder="Phone"
          />
          {userType === 'provider' && (
            <>
              <TextInput
                style={styles.input}
                value={userData.description}
                onChangeText={(text) => setUserData({ ...userData, description: text })}
                editable={isEditable}
                placeholder="Description"
                multiline
              />
              <TextInput
                style={styles.input}
                value={userData.address}
                onChangeText={(text) => setUserData({ ...userData, address: text })}
                editable={isEditable}
                placeholder="Address"
              />
              <TextInput
                style={styles.input}
                value={userData.city}
                onChangeText={(text) => setUserData({ ...userData, city: text })}
                editable={isEditable}
                placeholder="City"
              />
              <TextInput
                style={styles.input}
                value={userData.district}
                onChangeText={(text) => setUserData({ ...userData, district: text })}
                editable={isEditable}
                placeholder="District"
              />
              <TextInput
                style={styles.input}
                value={String(userData.averagePrice)}
                onChangeText={(text) => setUserData({ ...userData, averagePrice: text })}
                editable={isEditable}
                keyboardType="numeric"
                placeholder="Average Price"
              />
              <Text style={styles.subtitle}>Services</Text>
              <View style={styles.servicesContainer}>
                {userData.services.map((service, index) => (
                  <View key={index} style={styles.serviceCard}>
                    <Text style={styles.serviceCardText}>{service.serviceName}</Text>
                  </View>
                ))}
              </View>
              {showAddService && (
                <View style={styles.addServiceContainer}>
                  <TextInput
                    style={styles.input}
                    value={newServiceName}
                    onChangeText={setNewServiceName}
                    placeholder="New Service Name"
                  />
                  <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleAddService}>
                    <Text style={styles.buttonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
          <View style={styles.buttonGroup}>
            {isEditable && (
              <TouchableOpacity 
                style={styles.button} 
                onPress={handleUpdate}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
            )}
            {!isEditable && (
              <TouchableOpacity 
                style={styles.button} 
                onPress={toggleEdit}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.button} onPress={handleSignOut}>
              <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
            {userType === 'provider' && (
              <TouchableOpacity 
                style={styles.button} 
                onPress={handleAddServiceToggle}>
                <Text style={styles.buttonText}>{showAddService ? 'Cancel' : 'Add Service'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};




const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'flex-start', // Changed from 'center' to 'flex-start'
  },
  title: {
    fontSize: 30, 
    marginTop: 50,
    fontWeight: 'bold', 
    color: '#708DA1', 
    alignSelf: 'flex-start', // Align to the left
    marginLeft: 30,
    marginBottom: 30, 
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#708DA1',
    marginTop: 30,
    marginBottom: 5,
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
    backgroundColor: '#708DA1',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  serviceCard: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    padding: 10,
    margin: 5,
  },
  serviceCardText: {
    fontSize: 14,
    color: '#708DA1',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
    color: '#354F61',
  },
  addServiceContainer: {
    marginTop: 10,
  },
});

export default ProfileScreen;
