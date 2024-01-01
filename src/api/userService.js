const API_BASE_URL = "http://3.88.103.123:3001"; // Replace with your server's base URL

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

export const updateUserProfile = async (userId, updatedData, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                ...updatedData // Spread the updatedData object which contains name, email, and phone
            })
        });

        if (!response.ok) {
            throw new Error('Error updating profile');
        }
        return await response.json();
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};