import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = error.message || 'An unexpected error occurred';
    
    if (error.response?.data?.error) {
      const apiErr = error.response.data.error;
      if (apiErr.details && apiErr.details.length > 0) {
        message = `${apiErr.message}: ${apiErr.details.map(d => d.message).join(', ')}`;
      } else {
        message = apiErr.message;
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default client;
