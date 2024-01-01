const API_BASE_URL = "http://3.88.103.123:3001"; // Replace with your server's base URL

// Function to sign up a user
export const signupUser = async (userInfo) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userInfo),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Could not sign up user.');
        }

        return data; // contains user info and token
    } catch (error) {
        throw error;
    }
};

// Function to sign in a user
export const signinUser = async (credentials) => {
    try {
        console.log(credentials)
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();
        console.log(data)
        if (!response.ok) {
            throw new Error(data.message || 'Could not sign in user.');
        }

        return data; // contains user info and token
    } catch (error) {
        throw error;
    }
};
