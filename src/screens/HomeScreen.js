import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../contexts/AuthContext'; // Ensure the path is correct
import { fetchUniqueServices } from '../api/servicesService'; // Ensure the path is correct

const HomeScreen = () => {
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [services, setServices] = useState([]);
    const { userInfo } = useContext(AuthContext);
    const navigation = useNavigation();

    const getGeoreversedAddress = async (latitude, longitude) => {
        try {
          const apiKey = 'AIzaSyB1kNalSleV7Vf8A-5OyKykMbNv8r-HhDY'; // Replace with your actual Google Geocoding API key
          const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
            const data = await response.json();

            let city = '';
            let street = '';

            if (data.results.length > 0) {
                const addressComponents = data.results[0].address_components;

                addressComponents.forEach(component => {
                    if (component.types.includes('locality')) {
                        city = component.long_name;
                    }
                    if (component.types.includes('route')) {
                        street = component.long_name;
                    }
                });
            }

            return [street, city].filter(Boolean).join(', ') || 'Address not found';
        } catch (error) {
            console.error('Error fetching address:', error);
            return 'Address not found';
        }
    };

    const loadSelectedAddress = async () => {
        try {
            const addressString = await AsyncStorage.getItem('selectedAddress');
            if (addressString) {
                const address = JSON.parse(addressString);
                const georeversedAddress = await getGeoreversedAddress(address.lat, address.lon);
                setSelectedAddress({...address, georeversedAddress});
            }
        } catch (error) {
            console.error('Error reading selected address:', error);
            Alert.alert('Error', 'Failed to load selected address');
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await loadSelectedAddress();
            try {
                const fetchedServices = await fetchUniqueServices();
                setServices(fetchedServices);
            } catch (error) {
                console.error('Error loading services:', error);
            }
        };

        loadData();
    }, [userInfo]);

    useFocusEffect(
        useCallback(() => {
            loadSelectedAddress(); // Re-fetch the selected address when the screen is focused
        }, [])
    );

    const handleSelectService = (serviceName) => {
        navigation.navigate('ServiceProviders', { serviceName });
    };

    const renderServiceItem = ({ item }) => (
        <TouchableOpacity style={styles.serviceCard} onPress={() => handleSelectService(item)}>
            <Text style={styles.serviceCardText}>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            
            <TouchableOpacity style={styles.addressContainer} onPress={() => navigation.navigate('AddAddress')}>
                {selectedAddress ? (
                    <Text style={styles.addressText}>
                        Address: {selectedAddress.georeversedAddress}
                        {selectedAddress.buildingNo ? `, Building No - ${selectedAddress.buildingNo}` : ''}
                        {selectedAddress.flatNo ? `, Flat No - ${selectedAddress.flatNo}` : ''}
                    </Text>
                ) : (
                    <Text style={styles.addressText}>No address selected. Tap to add.</Text>
                )}
            
            </TouchableOpacity>
            <Text style={styles.questionText}>What kind of help do you need ? YETİŞ's business partners are with you!</Text>
            <FlatList
                data={services}
                renderItem={renderServiceItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                contentContainerStyle={styles.servicesList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    
  
    
    addressContainer: {
        backgroundColor: '#708DA1',
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    addressText: {
        paddingTop: 60,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    questionText: {
        fontSize: 18,                    
        fontWeight: 'bold',
        color: '#708DA1',                
        marginTop: 30,                  
        marginLeft: 20,                 
        marginRight: 10,                
        textShadowColor: 'rgba(0, 0, 0, 0.5)',   
        textShadowOffset: { width: 2, height: 2 }, 
        textShadowRadius: 5              
    },
    
    servicesList: {
        
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    serviceCard: {
        flex: 1,
        margin: 5,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#708DA1',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    serviceCardText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default HomeScreen;
