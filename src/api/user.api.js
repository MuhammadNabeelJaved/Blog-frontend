import axios from "axios";


const USER_URL = import.meta.env.VITE_API_USERS_BASE_URL || "http://localhost:3000/api/users";

console.log("Use Api Base URL: ", import.meta.env.VITE_API_USERS_BASE_URL)

export const currentUser = async (id) => {
    const response = await axios.get(`${USER_URL}/${id}`);
    return response.data;
}

