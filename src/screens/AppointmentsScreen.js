import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  fetchAppointmentsForCustomer, 
  fetchAppointmentsForProvider, 
  approveAppointment, 
  rejectAppointment, 
  cancelAppointment 
} from '../api/appointmentService'; // adjust path as needed

const AppointmentsScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [userType, setUserType] = useState(null);
  const [refreshing, setRefreshing] = useState(false);


  useEffect(() => {
    initializeScreen();
  }, []);

  const initializeScreen = async () => {
    setRefreshing(true);
    const userTypeValue = await AsyncStorage.getItem('userType');
    setUserType(userTypeValue);

    const userInfo = await AsyncStorage.getItem('userInfo');
    const userId = JSON.parse(userInfo).id;

    const fetchedAppointments = userTypeValue === 'customer'
      ? await fetchAppointmentsForCustomer(userId)
      : await fetchAppointmentsForProvider(userId);

    const appointmentsWithAddress = await Promise.all(fetchedAppointments.map(async (appointment) => {
      const address = await getGeoreversedAddress(appointment.lat, appointment.lon);
      return { ...appointment, address };
    }));

    setAppointments(appointmentsWithAddress);
    setRefreshing(false);
  };

  const getGeoreversedAddress = async (latitude, longitude) => {
    const apiKey = 'AIzaSyB1kNalSleV7Vf8A-5OyKykMbNv8r-HhDY'; // Replace with your actual Google Geocoding API key
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
      const data = await response.json();
      console.log(data)
    try {
      const apiKey = 'AIzaSyB1kNalSleV7Vf8A-5OyKykMbNv8r-HhDY'; // Replace with your actual Google Geocoding API key
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
      const data = await response.json();

      let city = '';
      let street = '';

      if (data.results.length > 0) {
        const addressComponents = data.results[0].address_components;

        addressComponents.forEach(component => {
          if (component.types.includes('administrative_area_level_1')) {
            city = component.long_name;
          }
          if (component.types.includes('route')) {
            street = component.long_name;
          }
        });
      }

      const address = [street, city].filter(Boolean).join(', ');
      return address || 'Address not found';
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Address not found';
    }
};


  const handleAction = async (appointmentId, action) => {
    try {
      let response;
      if (action === 'approve') {
        response = await approveAppointment(appointmentId);
      } else if (action === 'reject') {
        response = await rejectAppointment(appointmentId);
      } else if (action === 'cancel') {
        response = await cancelAppointment(appointmentId);
      }
      console.log("hello", response)
      if (response.success) {
        Alert.alert("Success", response.message);
        initializeScreen(); // Refresh the appointments list
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      console.error("Appointment Action Error:", error);
      Alert.alert("Error", "An error occurred while processing your request.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.serviceName}>{item.service.serviceName}</Text>
      {userType === 'customer' ? (
        <Text style={styles.providerName}>Provider: {item.serviceProvider.name}</Text>
      ) : (
        <Text style={styles.customerName}>Customer: {item.customer.name}</Text>
      )}
      <Text style={styles.detail}>Address: {item.address}</Text>
      <Text style={styles.detail}>Building No: {item.buildingNo}, Flat No: {item.flatNo}</Text>
      <Text style={styles.detail}>Date: {item.date}</Text>
      <Text style={styles.detail}>Time: {item.time}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
      {userType === 'provider' && item.status === 'pending approval' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleAction(item.id, 'approve')}>
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleAction(item.id, 'reject')}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
      {userType === 'customer' && item.status === 'pending approval' && (
        <TouchableOpacity 
          style={[styles.actionButton, styles.cancelButton]}
          onPress={() => handleAction(item.id, 'cancel')}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={initializeScreen}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
  },
  card: {
    backgroundColor: '#708DA1',
    top: 40,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  providerName: {
    fontSize: 16,
    marginBottom: 5,
  },
  customerName: {
    fontSize: 16,
    marginBottom: 5,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  status: {
    fontSize: 16,
    fontWeight: '500',
    color: 'red',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
  cancelButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AppointmentsScreen;
