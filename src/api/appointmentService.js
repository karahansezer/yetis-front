//BASE URL
const API_BASE_URL = "http://192.168.1.106:3001"; // Replace with your server's base URL
// Function to create an appointment
export const createAppointment = async (appointmentData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/appointments`, { // Adjust the URL as per your API endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("There was a problem creating the appointment:", error);
    }
};