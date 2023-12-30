const API_BASE_URL = "http://192.168.1.106:3001"; // Replace with your actual API base URL

export const fetchProviderById = async (providerId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/service-provider/${providerId}`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("There was a problem fetching provider details:", error);
    }
};

export const updateServiceProviderProfile = async (providerId, updatedData, token) => {
    console.log(providerId, updatedData)
    try {
        const response = await fetch(`${API_BASE_URL}/service-provider/update/${providerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData) // Spread the updatedData object which contains the provider's updated information
        });

        if (!response.ok) {
            console.log(response)
            throw new Error('Error updating provider profile');
        }
        return await response.json();
    } catch (error) {
        console.error("Error updating service provider profile:", error);
        throw error;
    }
};