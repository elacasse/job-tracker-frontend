import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
  },
});

// Always attach App Token
api.interceptors.request.use((config) => {
  const appToken = import.meta.env.VITE_APP_TOKEN;
  if (appToken) {
    config.headers['X-App-Token'] = appToken;
  }

  // Attach user Bearer token if logged in
  const userToken = localStorage.getItem('userToken');
  if (userToken) {
    config.headers['Authorization'] = `Bearer ${userToken}`;
  }

  return config;
});

// Optional: Normalize JSON:API error format
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const json = error.response?.data;

    // Throw a clean error object
    return Promise.reject({
      status: error.response?.status,
      errors: json?.errors ?? [
        { title: 'Unknown Error', detail: error.message }
      ],
    });
  }
);

export default api;
