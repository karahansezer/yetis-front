const API_BASE_URL = "http://192.168.1.106:3001"; // Replace with your actual API base URL

export const fetchUniqueServices = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/service/unique`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("There was a problem fetching unique services:", error);
    }
};

export const fetchProvidersByService = async (serviceName, latitude, longitude) => {
    try {
        const response = await fetch(`${API_BASE_URL}/service/services-by-name`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ serviceName, latitude, longitude })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("There was a problem fetching service providers:", error);
    }
};
