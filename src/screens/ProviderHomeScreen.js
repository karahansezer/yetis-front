import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView , Image } from 'react-native';
import { AuthContext } from '../contexts/AuthContext'; // Ensure this path matches your project structure

const ProviderHomeScreen = () => {
  const { userInfo } = useContext(AuthContext);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image 
                source={require('../../assets/logo.png')} // Path to your logo image
                style={styles.logo}
            />
        <Text style={styles.title}>
              Important profile information for you to be preferred is as follows. To see your appointment requests, you can switch to the appointments page or update your information in the profile tab.
            </Text>
        
        {userInfo && (
          <View style={styles.card}>
            
            <Text style={styles.info}>Average Price: {userInfo.averagePrice} $ </Text>
            <Text style={styles.info}>Address: {userInfo.address}</Text>
            <Text style={styles.info}>City: {userInfo.city}</Text>
            <Text style={styles.info}>Phone: {userInfo.phone}</Text>
            {/* Add more fields as needed */}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // You can change the background color
  },
  card: {
    backgroundColor: '#708DA1', // Card background color
    borderRadius: 5, // Card border radius
    padding: 20, // Card padding
    marginTop : 40,
  },
  logo: {
    position: 'absolute', // Positioning the logo at the top left
    top: 0, 
    
    width: 150, // Adjust the width and height as needed
    height: 150,
    margin: 10, // Adding margin to give some space from the edge
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,                    
        fontWeight: 'bold',
        color: '#708DA1',
        alignSelf: 'flex-start',                
        marginTop: 120,                  
        marginLeft: 5,                 
        marginRight: 10,                
        textShadowColor: 'rgba(0, 0, 0, 0.5)',   
        textShadowOffset: { width: 2, height: 2 }, 
        textShadowRadius: 5
  },
  info: {
    fontSize: 20,
    top: 10,
    marginBottom: 10 ,
    color : 'white'
  },
});

export default ProviderHomeScreen;
