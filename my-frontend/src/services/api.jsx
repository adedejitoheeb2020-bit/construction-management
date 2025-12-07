import axios from "axios";

const api = axios.create ({
    base_url: "http://127.0.0.1:8000/api",
    withcredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
    refreshSubscribers.push(cb);
}

function onRefreshed(token) {
    refreshSubscribers.forEach(cb => cb(token));
    refreshSubscribers = [];
}

api.interceptors.request.use ( config => {
    const tokens = localStorage.getItem("access");
    if (tokens) config.headers["Authorization"] = `Bearer ${tokens}`;
    return config;
});

api.interceptors.response.use (
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh((tokens) => {
                        originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        resolve (api(originalRequest));
                    });
                });
            } 

            originalRequest._retry = True;
            isRefreshing = True;

            try {
                const res = await axios.post(" http://127.0.0.1:8000/api/refresh/", {}, { withcredentials: True});
                const newToken = res.data.access;
                localStorage.setItem = ("access", newToken);
                api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
                onRefreshed(newToken);
                isRefreshing = false;
                return api(originalRequest);
            }   catch (err) {
                isRefreshing = false;
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default api;