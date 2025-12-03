import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 8000
});

http.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(error)
);

export default http;
