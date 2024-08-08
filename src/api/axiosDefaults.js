import axios from 'axios';

// Set default configurations for axios
axios.defaults.baseURL = 'https://api-corner-44c2f4d4313e.herokuapp.com'; // Base URL for API requests
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'; // Default content type for POST requests
axios.defaults.withCredentials = true; // Include credentials (cookies, HTTP authentication) with requests

// Create axios instances for requests and responses
export const axiosReq = axios.create(); // Instance for making requests
export const axiosRes = axios.create(); // Instance for handling responses
