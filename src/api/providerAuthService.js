const API_BASE_URL = "http://192.168.1.106:3001/service-provider"; // Replace with your server's base URL

// Function to register a new service provider
export const registerServiceProvider = async (serviceProviderInfo) => {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(serviceProviderInfo),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Could not register service provider.');
        }

        return data; // contains service provider info
    } catch (error) {
        throw error;
    }
};

// Function to log in a service provider
export const loginServiceProvider = async (credentials) => {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Could not log in service provider.');
        }

        return data; // contains token and possibly other user info
    } catch (error) {
        throw error;
    }
};
