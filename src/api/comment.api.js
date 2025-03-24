import axios from "axios";

const COMMENTS_URL = import.meta.env.VITE_API_CREATE_COMMENTS_BASE_URL || "http://localhost:3000/api/comments/post-comment";


export const postComment = async (commentData) => {
    try {
        const response = await axios.post(
            `${COMMENTS_URL}/post-comment`,
            commentData
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

