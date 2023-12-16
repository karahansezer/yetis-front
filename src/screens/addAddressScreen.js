import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, Dimensions } from 'react-native';
import { AuthContext } from '../contexts/AuthContext'; // Adjust the import path
import { getUserAddresses, addUserAddress } from '../api/userService'; // Adjust the import path
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const AddAddressPage = () => {
    const [addresses, setAddresses] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newAddress, setNewAddress] = useState({ buildingNo: '', flatNo: '', lat: '', lon: '' });
    const [mapRegion, setMapRegion] = useState(null);
    const { userInfo } = useContext(AuthContext);

    useEffect(() => {
        loadAddresses();
    }, [userInfo]);

    const loadAddresses = async () => {
        try {
            const fetchedAddresses = await getUserAddresses(userInfo.id);
            if (fetchedAddresses) {
                setAddresses(fetchedAddresses);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const getCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setMapRegion({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        });
        setNewAddress({
            ...newAddress,
            lat: currentLocation.coords.latitude.toString(),
            lon: currentLocation.coords.longitude.toString(),
        });
    };

    useEffect(() => {
        if (modalVisible) {
            getCurrentLocation();
        }
    }, [modalVisible]);

    const handleAddAddress = async () => {
        try {
            await addUserAddress(userInfo.id, newAddress.lat, newAddress.lon, newAddress.buildingNo, newAddress.flatNo);
            setModalVisible(false);
            setNewAddress({ buildingNo: '', flatNo: '', lat: '', lon: '' }); // Reset form
            loadAddresses(); // Reload the addresses list
        } catch (error) {
            console.error('Error adding new address:', error);
            Alert.alert('Error', 'Failed to add address');
        }
    };

    const renderAddressItem = ({ item }) => (
        <View style={styles.addressCard}>
            <Text style={styles.addressText}>Building: {item.buildingNo}, Flat: {item.flatNo}</Text>
            {/* Additional address details can be displayed here */}
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={addresses}
                renderItem={renderAddressItem}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={<Text>No addresses found. Please add one.</Text>}
                contentContainerStyle={styles.addressList}
            />
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>Add New Address</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setNewAddress({ ...newAddress, buildingNo: text })}
                            value={newAddress.buildingNo}
                            placeholder="Building No"
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setNewAddress({ ...newAddress, flatNo: text })}
                            value={newAddress.flatNo}
                            placeholder="Flat No"
                        />
                        {mapRegion && (
                            <MapView
                                style={styles.mapStyle}
                                region={mapRegion}
                                onRegionChangeComplete={(region) => {
                                    setMapRegion(region);
                                    setNewAddress({
                                        ...newAddress,
                                        lat: region.latitude.toString(),
                                        lon: region.longitude.toString(),
                                    });
                                }}>
                                <Marker coordinate={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }} />
                            </MapView>
                        )}
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={handleAddAddress}>
                            <Text style={styles.textStyle}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    addressList: {
        paddingHorizontal: 10,
    },
    addressCard: {
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        padding: 15,
        marginVertical: 5,
    },
    addressText: {
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        margin: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
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
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: 200,
    },
    mapStyle: {
        width: Dimensions.get('window').width * 0.8,
        height: 200,
        marginTop: 10,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default AddAddressPage;
