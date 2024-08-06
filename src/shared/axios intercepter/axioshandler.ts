import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/v1', // Replace with your API base URL
  timeout: 10000, // Set a timeout (in milliseconds)
});


function getAccessToken() {
    const data = localStorage.getItem(`gth-access-token`)
    return data
}

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {

    const accessToken: any = getAccessToken()
    // Add authentication token
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
  }

    // Add custom Origin header
    config.headers['Origin'] = 'http://localhost:5173'; // Replace with your origin

    // Log the request
    console.log('Starting Request', config);

    return config;
  },
  (error) => {
    // Handle request error
    console.error('Request error', error);
    return Promise.reject(error);
  }
);

// Response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => {
//     // Log the response
//     console.log('Response:', response);

//     return response;
//   },
//   (error) => {
//     if (error.response) {
//       // Server responded with a status other than 2xx
//       console.error('Response error', error.response);
//       if (error.response.status === 401) {
//         // Handle 401 Unauthorized error (e.g., redirect to login)
//         console.error('Unauthorized, redirecting to login...');
//       }
//     } else if (error.request) {
//       // Request was made but no response received
//       console.error('No response received', error.request);
//     } else {
//       // Something else happened while setting up the request
//       console.error('Error', error.message);
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
