import axios from "axios";

// Unified API client pointing to the Express backend server port
export const apiClient = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
