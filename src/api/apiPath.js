const BASE_URL = 'https://tender-rfp-backend.azurewebsites.net';

export const API_ENDPOINTS = {
    GOOGLE_AUTH_START: `${BASE_URL}/auth/google/start`,
    GOOGLE_AUTH_TOKEN: `${BASE_URL}/google/session-data`,
    TENDER_UPLOAD: `${BASE_URL}/tender/upload`,
    // Add more endpoints here as needed
};
