/**
 * Common API utility for making HTTP requests
 */


// import { getAuthStart} from "./apiConfig";
import axiosInstance from "./axiosInstance";
import { API_ENDPOINTS } from "./apiPath";


// ####### GET request to GOOGLE_AUTH_START endpoint #######
export async function fetchAuthStart() {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.GOOGLE_AUTH_START);
        return response.data;
    } catch (error) {
        console.error("Error fetching auth start:", error);
        return {
            succeeded: false,
            message:
                error.response?.data?.error ||
                "An error occurred while fetching auth start",
        };
    }
}

// ####### POST request to TENDER_UPLOAD endpoint with streaming response #######
export async function uploadTenderFile(file, onChunk) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(API_ENDPOINTS.TENDER_UPLOAD, {
        method: 'POST',
        body: formData,
        // credentials: 'include', // for cookies
    });

    if (!response.body) throw new Error('No response body (streaming not supported)');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let allChunks = '';

    while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
            const chunk = decoder.decode(value, { stream: !done });
            allChunks += chunk;
            if (onChunk) onChunk(chunk); // handle each chunk (e.g., append to UI)
        }
    }
    return allChunks;
}

// ####### GET request to GOOGLE_AUTH_TOKEN endpoint with token param #######
export async function fetchGoogleSessionData(token) {
    try {
        const url = `${API_ENDPOINTS.GOOGLE_AUTH_TOKEN}?token=${encodeURIComponent(token)}`;
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        console.error('API GET error:', error);
        throw error;
    }
}
