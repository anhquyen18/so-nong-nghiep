import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL, // Đổi thành domain API mới
  // baseURL: 'https://api.tamky.click/api',
  timeout: 10000, // Timeout mặc định
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
