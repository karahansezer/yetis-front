import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, Alert, TextInput
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchProviderById } from '../api/providerService'; // Adjust the import path
import { createAppointment } from '../api/appointmentService'; // Adjust import path
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCommentsForProvider, createCommentForProvider } from '../api/commentService'; // Import comment-related services

const ServiceProviderDetailsScreen = ({ route }) => {
  const { providerId, serviceId, selectedServiceName } = route.params;
  const [provider, setProvider] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const loadProviderDetails = async () => {
      const providerData = await fetchProviderById(providerId);
      setProvider(providerData);

      const commentsData = await getCommentsForProvider(providerId);
      setComments(commentsData);
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


const timeSince = (dateString) => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);

  let interval = seconds / 31536000; // Number of seconds in one year

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000; // Number of seconds in one month
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  interval = seconds / 86400; // Number of seconds in one day
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600; // Number of seconds in one hour
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60; // Number of seconds in one minute
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
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
        status: 'pending approval',
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
  const handleMakeComment = async () => {
    try {
      const userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.id) {
        Alert.alert("Error", "User information not found.");
        return;
      }

      await createCommentForProvider(userInfo.id, providerId, newComment);
      setNewComment('');
      Alert.alert("Comment Submitted", "Your comment has been submitted successfully.");

      // Reload comments
      const updatedComments = await getCommentsForProvider(providerId);
      setComments(updatedComments);
    } catch (error) {
      console.error("Error creating comment:", error);
      Alert.alert("Error", "Failed to submit comment");
    }
  };

  if (!provider) {
    return <Text style={styles.loading}>Loading...</Text>;
  }
  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri:   'https://img.freepik.com/free-photo/man-electrical-technician-working-switchboard-with-fuses_169016-24062.jpg?size=626&ext=jpg&ga=GA1.1.1546980028.1702598400&semt=ais' }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{provider.name}</Text>
        <Text style={styles.description}>{provider.description}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Make Appointment</Text>
        </TouchableOpacity>
      </View>

      {/* Make Appointment Modal */}
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

      {/* Comment Section */}
      <View style={styles.commentSection}>
        <TextInput
          style={styles.commentInput}
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Write a comment..."
          multiline
        />
        <TouchableOpacity style={styles.commentButton} onPress={handleMakeComment}>
          <Text style={styles.commentButtonText}>Submit Comment</Text>
        </TouchableOpacity>
      </View>

      {/* Display Comments */}
      <View style={styles.commentsContainer}>
        {comments.map((comment, index) => (
          <View key={index} style={styles.comment}>
            <Text style={styles.commentText}>{comment.content}</Text>
            <Text style={styles.commentTime}>{timeSince(comment.createdAt)}</Text>
          </View>
        ))}
      </View>
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
    borderRadius: 30,
    marginTop: 20,
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
    backgroundColor: '#708DA1',
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
    marginTop: 20,
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
    backgroundColor: '#708DA1',
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
  commentSection: {
    padding: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  commentButton: {
    backgroundColor: '#708DA1',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  commentButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  commentsContainer: {
    padding: 10,
  },
  comment: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  commentText: {
    fontSize: 14,
  },
});

export default ServiceProviderDetailsScreen;
