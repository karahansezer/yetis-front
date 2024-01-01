const API_BASE_URL = "http://3.88.103.123:3001"; // Replace with your actual API base URL

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

export const createServiceForProvider = async (providerId, serviceName) => {
    console.log(JSON.stringify({ serviceName }))
    try {
        const response = await fetch(`${API_BASE_URL}/service/providers/${providerId}/services`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ serviceName }) // Send the service name as part of the request body
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("There was a problem creating the service:", error);
        throw error; // re-throw the error to handle it in the component
    }
};
