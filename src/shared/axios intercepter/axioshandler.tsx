import { useToast } from "@/components/ui/use-toast";
import useProjectStore from "@/store/projectStore";
import useUserStore from "@/store/userStore";
import axios from "axios";
import { useEffect } from "react";

type toastInterface = {
  title: string;
  description?: string;
  variant?: "default" | "success" | "destructive" | null | undefined;
};

// Custom hook for Axios with Toast notifications
const useAxiosWithToast = () => {
  const { toast } = useToast();

  // Create an Axios instance
  const axiosInstance = axios.create({
    baseURL:
      import.meta.env.VITE_ENVIRONMENT === "Local"
        ? "http://localhost:3000/api/v1"
        : "https://documentthing-backend-production.up.railway.app/api/v1", // Replace with your API base URL
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

  // Function to handle showing toasts
  const showToast = ({ title, description = "", variant = "default" }: toastInterface) => {
    toast({
      title: title,
      description: description,
      variant: variant,
    });
  };

  // Set up interceptors inside `useEffect` to ensure they are initialized only once
  useEffect(() => {
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
        showToast({
          title: "Request Error",
          description: "An error occurred while sending the request.",
          variant: "destructive",
        });
        console.error("Request error", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const statusCode = error.response.status;
          switch (statusCode) {
            case 401:
              showToast({
                title: "Unauthorized",
                description: "Your session has expired. Redirecting to login...",
                variant: "destructive",
              });
              localStorage.clear()
              setTimeout(()=>{
                window.location.href = "/account/login"; // Example redirect
              },1000)
              break;
            case 403:
              showToast({
                title: "Forbidden",
                description: "You do not have access to this resource.",
                variant: "destructive",
              });
              break;
            case 404:
              showToast({
                title: "Not Found",
                description: "The requested resource was not found.",
                variant: "destructive",
              });
              break;
            case 500:
              showToast({
                title: "Server Error",
                description: "A server error occurred. Please try again later.",
                variant: "destructive",
              });
              break;
            default:
              showToast({
                title: "Error",
                description: "An error occurred while processing the response.",
                variant: "destructive",
              });
              break;
          }
        } else if (error.request) {
          showToast({
            title: "Network Error",
            description: "No response received. Please check your network connection.",
            variant: "destructive",
          });
          console.error("No response received", error.request);
        } else {
          showToast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
          console.error("Error", error.message);
        }

        return Promise.reject(error);
      }
    );
  }, [axiosInstance]); // Only re-run this effect if axiosInstance changes

  return axiosInstance;
};

export default useAxiosWithToast;
