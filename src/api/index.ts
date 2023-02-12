import axios from 'axios';

const { VITE_BASE_URL: BASE_URL, VITE_API_PORT: PORT, PROD: isProduction } = import.meta.env;

const privateAxiosInstance = axios.create({
  baseURL: `${isProduction ? 'https' : 'http'}://${BASE_URL}:${PORT}`,
});

export const axiosInstance = axios.create({
  baseURL: `${isProduction ? 'https' : 'http'}://${BASE_URL}:${PORT}`,
});

export default privateAxiosInstance;
