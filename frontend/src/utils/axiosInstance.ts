import axios from 'axios';
import { TokenHelper } from './TokenHelper';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    console.log('Axios Request: Checking token for request to:', config.url);
    const token = TokenHelper.getToken();
    
    if (token) {
      // Check if token is expired or needs refresh
      if (TokenHelper.isTokenExpired(token)) {
        console.log('Axios Request: Token expired, attempting refresh');
        try {
          // Attempt to refresh token
          const response = await axios.post('http://localhost:3001/user/refresh-token', {
            token: token
          });
          
          const newToken = response.data.token;
          console.log('Axios Request: Token refreshed successfully');
          TokenHelper.setToken(newToken);
          config.headers.Authorization = `Bearer ${newToken}`;
        } catch (error) {
          console.log('Axios Request: Token refresh failed, redirecting to login');
          // If refresh fails, remove token and redirect to login
          TokenHelper.removeToken();
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } else {
        console.log('Axios Request: Using existing token');
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      console.log('Axios Request: No token found');
    }
    
    return config;
  },
  (error) => {
    console.error('Axios Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Axios Response: Request successful');
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Axios Response: Received 401, attempting token refresh');
      originalRequest._retry = true;

      try {
        const token = TokenHelper.getToken();
        if (!token) {
          throw new Error('No token available');
        }

        const response = await axios.post('http://localhost:3001/user/refresh-token', {
          token: token
        });

        const newToken = response.data.token;
        console.log('Axios Response: Token refreshed successfully');
        TokenHelper.setToken(newToken);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log('Axios Response: Token refresh failed, redirecting to login');
        // If refresh fails, remove token and redirect to login
        TokenHelper.removeToken();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;