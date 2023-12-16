import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { fetchProvidersByService } from '../api/servicesService'; // Ensure the path is correct

const ServiceProvidersScreen = ({ route, navigation }) => {
    const { serviceName } = route.params;
    const [providers, setProviders] = useState([]);

    useEffect(() => {
        const loadProviders = async () => {
            const latitude = 40.7128; // Replace with actual user coordinates
            const longitude = -74.0060;
            const data = await fetchProvidersByService(serviceName, latitude, longitude);
            setProviders(data);
        };

        loadProviders();
    }, [serviceName]);

    const navigateToProviderDetails = (providerId, selectedServiceName) => {
        navigation.navigate('ServiceProviderDetails', { providerId, selectedServiceName });
    };
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigateToProviderDetails(item.id, serviceName)}>
            <Image source={{ uri: 'https://img.freepik.com/free-photo/man-electrical-technician-working-switchboard-with-fuses_169016-24062.jpg?size=626&ext=jpg&ga=GA1.1.1546980028.1702598400&semt=ais' }} style={styles.image} />
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>Distance: {item.distance.toFixed(2)} km</Text>
            {/* Add more details as required */}
            </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>{serviceName}</Text>
            <FlatList
                data={providers}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    list: {
        paddingHorizontal: 10,
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginVertical: 5,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 10,
    },
});

export default ServiceProvidersScreen;
