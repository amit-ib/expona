/**
 * Common API utility for making HTTP requests
 */

// import { getAuthStart} from "./apiConfig";
import axiosInstance from "./axiosInstance";
import { API_ENDPOINTS } from "./apiPath";
import { AUTH_TOKEN } from "./authToken";

// #######  GOOGLE_AUTH endpoint #######
export function verifyToken(token) {
  return axiosInstance.get(API_ENDPOINTS.GOOGLE_TOKEN, {
    headers: { "access-token": token, "Content-Type": "application/json" },
  });
}
// #######  Local Stored JWT Token #######
const getAuthHeaders = () => {
  const authToken = localStorage.getItem("securedToken");
  return {
    Authorization: `Bearer ${authToken}`,
  };
};

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
export async function uploadTenderFile(files, onChunk, token = AUTH_TOKEN) {
  // Accepts single File or array of Files
  const formData = new FormData();
  if (Array.isArray(files)) {
    files.forEach((file) => formData.append("files", file));
  } else {
    formData.append("files", files);
  }
  // Grab tender_id from localStorage if present
  const tender_id = localStorage.getItem("TENDER_ID");
  if (tender_id) {
    formData.append("tender_id", tender_id);
  }
  const authHeaders = getAuthHeaders();
  const response = await fetch(API_ENDPOINTS.TENDER_UPLOAD, {
    method: "POST",
    body: formData,
    headers: authHeaders,
    // credentials: 'include', // for cookies
  });

  if (!response.body)
    throw new Error("No response body (streaming not supported)");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let done = false;
  let allChunks = "";

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
    const url = `${API_ENDPOINTS.GOOGLE_AUTH_TOKEN}?token=${encodeURIComponent(
      token
    )}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("API GET error:", error);
    throw error;
  }
}

// ####### POST request to TENDER_LIST endpoint to get tender list #######
export async function fetchTenderList(data) {
  try {
    const authHeaders = getAuthHeaders();
    const response = await axiosInstance.post(API_ENDPOINTS.TENDER_LIST, data, {
      headers: authHeaders,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tender list:", error);
    throw error;
  }
}

// ####### DELETE request to TENDER_DELETE endpoint to delete a tender by id #######
export async function deleteTenderById(tender_id) {
  try {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.TENDER_DELETE}?tender_id=${encodeURIComponent(
        tender_id
      )}`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting tender:", error);
    throw error;
  }
}

// ####### POST request to STORE_COMPANY_DETAIL endpoint #######
export async function storeCompanyDetail(data) {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.STORE_COMPANY_DETAIL,
      data,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error storing company detail:", error);
    throw error;
  }
}

// ####### GET request to FETCH_COMPANY_PROFILE endpoint with company_id as query param #######
export async function fetchCompanyProfile(company_id) {
  try {
    const url = `${
      API_ENDPOINTS.FETCH_COMPANY_PROFILE
    }?company_id=${encodeURIComponent(company_id)}`;
    const response = await axiosInstance.get(url, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching company profile:", error);
    throw error;
  }
}

// ####### POST request to UPLOAD_COMPANY_DOC endpoint #######
export async function uploadCompanyDocument(
  { file, company_id, tender_id, documentType, criteria_name },
  token = AUTH_TOKEN
) {
  const formData = new FormData();
  formData.append(documentType, file);
  let url = `${
    API_ENDPOINTS.UPLOAD_COMPANY_DOC
  }?company_id=${encodeURIComponent(company_id)}`;
  if (tender_id) {
    url += `&tender_id=${encodeURIComponent(tender_id)}`;
  }
  if (criteria_name) {
    url += `&criteria_name=${encodeURIComponent(criteria_name)}`;
  }
  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to upload company document");
    }
    return await response.json();
  } catch (error) {
    console.error("Error uploading company document:", error);
    throw error;
  }
}

// ####### POST request to FETCH_TENDER_SUMMARY endpoint #######
export async function fetchTenderSummary() {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.FETCH_TENDER_SUMMARY,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tender summary:", error);
    throw error;
  }
}

// ####### GET request to FETCH_SUPPORTING_DOCS endpoint with company_id as query param #######
export async function fetchSupportingDocs(company_id) {
  try {
    const url = `${
      API_ENDPOINTS.FETCH_SUPPORTING_DOCS
    }?company_id=${encodeURIComponent(company_id)}`;
    const response = await axiosInstance.get(url, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching supporting docs:", error);
    throw error;
  }
}

// ####### GET request to FETCH_TENDER_REPORT endpoint with filename, company_id, and reevaluate as query params #######
export async function fetchTenderReport({
  tender_id,
  company_id,
  reevaluate = false,
}) {
  try {
    const url = `${
      API_ENDPOINTS.FETCH_TENDER_REPORT
    }?tender_id=${encodeURIComponent(
      tender_id
    )}&company_id=${encodeURIComponent(company_id)}&reevaluate=${reevaluate}`;
    const response = await axiosInstance.get(url, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tender report:", error);
    throw error;
  }
}

// ####### GET request to FETCH_ELIGIBILITY endpoint with filename and company_id as query params #######
export async function fetchEligibility({
  tender_id,
  company_id,
  reevaluate = false,
}) {
  try {
    const url = `${
      API_ENDPOINTS.FETCH_ELIGIBILITY
    }?tender_id=${encodeURIComponent(
      tender_id
    )}&company_id=${encodeURIComponent(company_id)}&reevaluate=${reevaluate}`;
    const response = await axiosInstance.get(url, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching eligibility:", error);
    throw error;
  }
}

// ####### DELETE request to DELETE_SUPPORTING_DOCS endpoint with company_id and document_id as query params #######
export async function deleteSupportingDoc({ company_id, document_id }) {
  try {
    const url = `${
      API_ENDPOINTS.DELETE_SUPPORTING_DOCS
    }?company_id=${encodeURIComponent(
      company_id
    )}&document_id=${encodeURIComponent(document_id)}`;
    const response = await axiosInstance.get(url, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting supporting document:", error);
    throw error;
  }
}

// ####### POST request to FETCH_REVISE_ELIGIBILITY endpoint with company_id, tender_id, criteria_name, criteria_type as query params, and criteria_name as form-data #######
export async function fetchReviseEligibility({
  company_id,
  tender_id,
  criteria_name,
  criteria_type,
  actionDescription,
  file,
  selectedOption,
}) {
  try {
    let url = `${
      API_ENDPOINTS.FETCH_REVISE_ELIGIBILITY
    }?company_id=${encodeURIComponent(
      company_id
    )}&tender_id=${encodeURIComponent(
      tender_id
    )}&criteria_type=${encodeURIComponent(criteria_type)}`;
    url += `&criteria_name=${encodeURIComponent(criteria_name)}`;
    if (actionDescription) {
      url += `&actionDescription=${encodeURIComponent(actionDescription)}`;
    }
    const formData = new FormData();

    if (actionDescription instanceof File) {
      formData.append(
        "actionDescription",
        actionDescription,
        actionDescription.name
      );
    }
    // else if (actionDescription) {
    //   formData.append("actionDescription", actionDescription);
    // }

    if (file && actionDescription) {
      formData.append(actionDescription, file);
    }
    if (selectedOption) {
      formData.append(actionDescription, selectedOption);
    }
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch revise eligibility");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching revise eligibility:", error);
    throw error;
  }
}

// ####### POST request to UPDATE_COMPANY_PROFILE endpoint with company_id as query param and profile data in body #######
export async function updateCompanyProfile(company_id, profileData) {
  try {
    const url = `${
      API_ENDPOINTS.UPDATE_COMPANY_PROFILE
    }?company_id=${encodeURIComponent(company_id)}`;

    const response = await axiosInstance.post(url, profileData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error updating company profile:", error);
    throw error;
  }
}

// ####### GET request for CHAT_CONVERSATION endpoint  #######
export async function ChatConversation({ company_id, query, tender_id }) {
  try {
    const url = `${
      API_ENDPOINTS.CHAT_CONVERSATION
    }?company_id=${encodeURIComponent(company_id)}&query=${encodeURIComponent(
      query
    )}&tender_id=${encodeURIComponent(tender_id)}`;
    const response = await axiosInstance.get(url, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error storing chat conversation:", error);
    throw error;
  }
}

// ####### GET request for CHAT_HISTORY endpoint  #######
export async function FetchChatHistory({ tender_id }) {
  try {
    const url = `${
      API_ENDPOINTS.FETCH_CHAT_HISTORY
    }?tender_id=${encodeURIComponent(tender_id)}`;
    if (!tender_id) {
      throw new Error("tender_id is required for ChatHistory API");
    }
    const response = await axiosInstance.get(url, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error getting chat history:", error);
    throw error;
  }
}

// ####### GET request for STORE_CHAT_FEEDBACK endpoint  #######
export async function StoreChatFeedback({ message_id, rating, feedback }) {
  try {
    const url = `${
      API_ENDPOINTS.STORE_CHAT_FEEDBACK
    }?message_id=${encodeURIComponent(message_id)}&rating=${encodeURIComponent(
      rating
    )}&feedback=${encodeURIComponent(feedback)}`;
    const response = await axiosInstance.get(url, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error storing chat feedback:", error);
    throw error;
  }
}

// ####### POST request for UPDATE_TENDER_TITLE endpoint  #######
export async function updateTenderTitle(tender_id, new_title) {
  try {
    const url = `${
      API_ENDPOINTS.UPDATE_TENDER_TITLE
    }?tender_id=${encodeURIComponent(tender_id)}&new_title=${encodeURIComponent(
      new_title
    )}`;

    const response = await axiosInstance.post(
      url,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating tender title:", error);
    throw error;
  }
}
// ####### GET request for SAVE_TO_KEYAREA endpoint  #######
export async function SaveToKeyarea({ answer_id, saved }) {
  try {
    const url = `${
      API_ENDPOINTS.SAVE_TO_KEYAREA
    }?answer_id=${encodeURIComponent(answer_id)}&saved=${encodeURIComponent(
      saved
    )}`;
    const response = await axiosInstance.post(
      url,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error storing to key area:", error);
    throw error;
  }
}
