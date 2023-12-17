import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchProviderById } from '../api/providerService'; // Adjust the import path
import { createAppointment } from '../api/appointmentService'; // Adjust import path
import AsyncStorage from '@react-native-async-storage/async-storage';


const ServiceProviderDetailsScreen = ({ route }) => {
  const { providerId, serviceId, selectedServiceName } = route.params; // Get providerId and serviceId from navigation params
  const [provider, setProvider] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const loadProviderDetails = async () => {
      const data = await fetchProviderById(providerId);
      setProvider(data);
    };

    loadProviderDetails();
  }, [providerId]);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setTime(currentTime);
  };

  const handleMakeAppointment = async () => {
    try {
      const customerInfo = await AsyncStorage.getItem('userInfo');
      const selectedAddress = await AsyncStorage.getItem('selectedAddress');
      const customerId = JSON.parse(customerInfo)?.id;
      const addressInfo = JSON.parse(selectedAddress);
  
      if (!customerId || !addressInfo) {
        Alert.alert("Error", "Required information is missing.");
        return;
      }
  
      const appointmentDetails = {
        customerId,
        serviceProviderId: providerId,
        serviceId: serviceId,
        date: date.toISOString().split('T')[0], // Format date
        time: time.toISOString().split('T')[1].split('.')[0], // Format time
        status: 'waiting',
        flatNo: addressInfo.flatNo,
        buildingNo: addressInfo.buildingNo,
        lat: addressInfo.lat,
        lon: addressInfo.lon
      };
  
      const response = await createAppointment(appointmentDetails);
      setModalVisible(false);
      Alert.alert("Appointment Created", "Your appointment has been successfully created.");
    } catch (error) {
      console.error("Error creating appointment:", error);
      Alert.alert("Error", "Failed to create appointment");
    }
  };
  

  if (!provider) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: provider.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{provider.name}</Text>
        <Text style={styles.description}>{provider.description}</Text>
        {/* Add more provider details as needed */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Make Appointment</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={onChangeTime}
            />
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleMakeAppointment}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
    color: '#000',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  content: {
    padding: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ServiceProviderDetailsScreen;
