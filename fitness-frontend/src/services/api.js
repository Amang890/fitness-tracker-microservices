import axios from "axios";

const API_URL =
    "http://localhost:8085/api";

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use((config) => {

    const userId =
        localStorage.getItem("userId");

    const token =
        localStorage.getItem("token");

    // Registration is a public endpoint,
    // so don't send old token/userId with register request
    const isRegisterRequest =
        config.url === "/users/register";

    if (token && !isRegisterRequest) {
        config.headers["Authorization"] =
            `Bearer ${token}`;
    }

    if (userId && !isRegisterRequest) {
        config.headers["X-User-ID"] =
            userId;
    }

    return config;
});


export const getActivities = () =>
    api.get("/activities");


export const addActivity = (activity) =>
    api.post(
        "/activities/trackActivity",
        activity
    );


export const getActivityDetail = (id) =>
    api.get(
        `/recommendations/activity/${id}`
    );


export const registerUser = (userData) =>
    api.post(
        "/users/register",
        userData
    );