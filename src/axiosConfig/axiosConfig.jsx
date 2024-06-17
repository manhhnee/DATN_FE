import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to check if the token is expired
const isTokenExpired = (token) => {
  if (!token) {
    return true;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decodedToken.exp < currentTime;
  } catch (error) {
    return true;
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('jwt');

    if (token) {
      if (isTokenExpired(token)) {
        Cookies.remove('jwt');
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.setItem('userId', '');
        localStorage.setItem('Role', '');
        window.location.href = '/login';
        return Promise.reject(new Error('Token has expired'));
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
