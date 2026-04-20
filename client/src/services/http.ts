import axios from 'axios';

export const http = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
});

http.interceptors.response.use(
    (response) => response, (error) => {
        const message = error?.response?.data?.message || error.message || "API Error";
        return Promise.reject(new Error(message));
    }
)