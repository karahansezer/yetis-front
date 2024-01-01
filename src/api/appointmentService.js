//BASE URL
const API_BASE_URL = "http://3.88.103.123:3001"; // Replace with your server's base URL
// Function to create an appointment
export const createAppointment = async (appointmentData) => {
    console.log(JSON.stringify(appointmentData))
    try {
        const response = await fetch(`${API_BASE_URL}/appointment`, { // Adjust the URL as per your API endpoint
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

export const fetchAppointmentsForCustomer = async (customerId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/appointment/customer/${customerId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching appointments:", error);
        throw error;
    }
};

// Function to fetch appointments for a service provider
export const fetchAppointmentsForProvider = async (providerId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/appointment/provider/${providerId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching appointments for provider:", error);
        throw error;
    }
};

// Function to approve an appointment
export const approveAppointment = async (appointmentId) => {
    console.log(appointmentId)
    try {
        const response = await fetch(`${API_BASE_URL}/appointment/approve/${appointmentId}`, {
            method: 'PUT'
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Error approving appointment:", error);
        throw error;
    }
};

// Function to reject an appointment
export const rejectAppointment = async (appointmentId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/appointment/reject/${appointmentId}`, {
            method: 'PUT'
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Error rejecting appointment:", error);
        throw error;
    }
};

// Function to cancel an appointment
export const cancelAppointment = async (appointmentId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/appointment/cancel/${appointmentId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Error canceling appointment:", error);
        throw error;
    }
};