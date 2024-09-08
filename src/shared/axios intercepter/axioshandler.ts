import useProjectStore from "@/store/projectStore";
import useUserStore from "@/store/userStore";
import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1", // Replace with your API base URL
  timeout: 300000, // Set a timeout (in milliseconds)
  withCredentials: true, // Send cookies with requests
});

// Function to get user ID from store
function getUserID() {
  return useUserStore.getState().user?.ID;
}
function getProjectID() {
  return useProjectStore.getState().project?.Id;
}

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const userID = getUserID();
    if (userID) {
      config.headers["X-User-Id"] = userID;
    }
    const projectID = getProjectID();
    if (projectID) {
      config.headers["X-Project-Id"] = projectID;
    }

    return config;
  },
  (error) => {
    console.error("Request error", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("Response error", error.response);
      if (error.response.status === 401) {
        console.error("Unauthorized, redirecting to login...");
        // Handle unauthorized access here
      }
    } else if (error.request) {
      console.error("No response received", error.request);
    } else {
      console.error("Error", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
