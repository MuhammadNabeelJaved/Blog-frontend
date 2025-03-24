import axios from "axios";
// dotenv.config();

const BLOG_URL = import.meta.env.VITE_API_BLOGS_BASE_URL || "http://localhost:3000/api/blogs";



export const getBlogs = async () => {
    try {
        const response = await axios.get(`${BLOG_URL}`);
        return response.data?.data;
    } catch (error) {
        console.log(error);
    }
};

export const createBlog = async (blogData) => {
    try {
        const response = await axios.post(
            `${BLOG_URL}/create-blog`,
            blogData
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
};


export const currentUserBlogs = async () => {
    try {
        const response = await axios.post(
            `${BLOG_URL}/current-user-blog-post`
        );

        return response.data.data;
    } catch (error) {
        console.log(error);
    }
};




