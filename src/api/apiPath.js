const BASE_URL = 'https://tender-rfp-backend.azurewebsites.net';

export const API_ENDPOINTS = {
    // GOOGLE_AUTH_START: `${BASE_URL}/auth/google/start`,
    // GOOGLE_AUTH_TOKEN: `${BASE_URL}/google/session-data`,
    GOOGLE_TOKEN: `${BASE_URL}/auth/google/token`,
    TENDER_UPLOAD: `${BASE_URL}/tender/upload`,
    TENDER_LIST: `${BASE_URL}/tender/tender_list`,
    TENDER_DELETE: `${BASE_URL}/tender/delete_tender`,
    FETCH_TENDER_SUMMARY: `${BASE_URL}/tender/tender_summary`,
    FETCH_SUPPORTING_DOCS: `${BASE_URL}/company/fetch_supporting_docs`,
    DELETE_SUPPORTING_DOCS: `${BASE_URL}/company/delete_supporting_doc`,
    FETCH_TENDER_REPORT: `${BASE_URL}/report/detailed_report`,
    FETCH_ELIGIBILITY: `${BASE_URL}/report/eligibility_report`,
    FETCH_REVISE_ELIGIBILITY: `${BASE_URL}/report/revise_eligibility`,
    STORE_COMPANY_DETAIL: `${BASE_URL}/company/fetch-from-web`,
    FETCH_COMPANY_PROFILE: `${BASE_URL}/company/details`,
    UPDATE_COMPANY_PROFILE: `${BASE_URL}/company/update`,
    UPLOAD_COMPANY_DOC: `${BASE_URL}/company/upload_supporting_docs`,


    // Add more endpoints here as needed
};
