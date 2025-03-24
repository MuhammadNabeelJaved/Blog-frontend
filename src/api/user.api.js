import axios from "axios";


const USER_URL = import.meta.env.VITE_API_USERS_BASE_URL || "http://localhost:3000/api/users";


export const currentUser = async (id) => {
    const response = await axios.get(`${USER_URL}/${id}`);
    return response.data;
}

export const registerUser = async (data) => {
    const response = await axios.post(`${USER_URL}/register`, data);
    return response.data;
}