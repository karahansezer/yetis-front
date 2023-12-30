const API_BASE_URL = "http://192.168.1.106:3001"; // Replace with your server's base URL

export const createCommentForProvider = async (userId, serviceProviderId, content) => {
    try {
        const response = await fetch(`${API_BASE_URL}/comment/provider/${serviceProviderId}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                content
            })
        });

        if (!response.ok) {
            throw new Error('Error creating comment');
        }
        return await response.json();
    } catch (error) {
        console.error("Error creating comment:", error);
        throw error;
    }
};

export const getCommentsForProvider = async (serviceProviderId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/comment/provider/${serviceProviderId}/comments`);

        if (response.status === 404) {
            return []; // Return an empty array if no comments found
        } else if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching comments for provider:", error);
        throw error;
    }
};
