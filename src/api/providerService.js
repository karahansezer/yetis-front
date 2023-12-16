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
