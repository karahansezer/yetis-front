const API_BASE_URL = "http://192.168.1.106:3001/users"; // Replace with your server's base URL

export const getUserAddresses = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/addresses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId })
        });
        console.log(response)
        if (response.status === 404) {
            return null; // Indicates no addresses found
        } else if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching user addresses:", error);
        throw error;
    }
};


export const addUserAddress = async (userId, lat, lon, buildingNo, flatNo) => {
    console.log(JSON.stringify({ userId, lat, lon, buildingNo, flatNo }))
    try {
        const response = await fetch(`${API_BASE_URL}/add-address`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, lat, lon, buildingNo, flatNo })
        });

        if (!response.ok) {
            throw new Error('Error adding address');
        }
        return await response.json();
    } catch (error) {
        console.error("Error adding address:", error);
        throw error;
    }
};