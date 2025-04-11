import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

interface DecodedToken {
  email: string;
  exp: number;
  iat: number;
}

export const TokenHelper = {
  // Store token in localStorage
  setToken: (token: string): void => {
    console.log('Setting token:', token);
    localStorage.setItem('jwtToken', token);
  },

  // Get token from localStorage
  getToken: (): string | null => {
    const token = localStorage.getItem('jwtToken');
    console.log('Getting token:', token ? 'Token exists' : 'No token found');
    return token;
  },

  // Remove token from localStorage
  removeToken: (): void => {
    console.log('Removing token');
    localStorage.removeItem('jwtToken');
  },

  // Check if token exists
  hasToken: (): boolean => {
    const hasToken = !!localStorage.getItem('jwtToken');
    console.log('Checking if token exists:', hasToken);
    return hasToken;
  },

  // Decode token
  decodeToken: (token: string): DecodedToken | null => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      console.log('Decoded token:', decoded);
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: (token: string): boolean => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = dayjs().unix();
      const isExpired = decoded.exp < currentTime;
      console.log('Token expiration check:', {
        currentTime,
        expirationTime: decoded.exp,
        isExpired
      });
      return isExpired;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  },

  // Get user email from token
  getUserEmail: (): string | null => {
    const token = TokenHelper.getToken();
    if (!token) return null;
    
    const decoded = TokenHelper.decodeToken(token);
    console.log('Getting user email from token:', decoded?.email);
    return decoded?.email || null;
  },

  // Check if token needs refresh (e.g., if it's within 5 minutes of expiring)
  needsRefresh: (token: string): boolean => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = dayjs().unix();
      const fiveMinutes = 5 * 60; // 5 minutes in seconds
      const needsRefresh = decoded.exp - currentTime < fiveMinutes;
      console.log('Token refresh check:', {
        currentTime,
        expirationTime: decoded.exp,
        timeUntilExpiry: decoded.exp - currentTime,
        needsRefresh
      });
      return needsRefresh;
    } catch (error) {
      console.error('Error checking if token needs refresh:', error);
      return true;
    }
  },

  // Logout function
  logout: (navigate?: (path: string) => void): void => {
    console.log('Logging out user');
    localStorage.removeItem('jwtToken');
    if (navigate) {
      navigate('/login');
    } else {
      window.location.href = '/login';
    }
  }
};