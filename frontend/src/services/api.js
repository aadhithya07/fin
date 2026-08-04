import axios from 'axios';

// Create an Axios instance pointing to your Node backend
const API = axios.create({
  baseURL: 'https://fin-shp9.onrender.com/api', 
});

// This interceptor automatically adds your JWT token to the headers of every request
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const parsedInfo = JSON.parse(userInfo);
    req.headers.Authorization = `Bearer ${parsedInfo.token}`;
  }
  return req;
});

export default API;