import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.API,
});

export default api;
