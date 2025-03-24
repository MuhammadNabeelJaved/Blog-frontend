import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router";
import { Pencil, Trash2, MessageCircle, Heart, Eye, Plus } from "lucide-react";
import { currentUserBlogs } from "../api/blog.api.js";
import Loader from "./Loader.jsx";

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loader, setLoader] = useState(true); // Set loader to true initially

  // const blog = blogs.map((blog) => {
  //   return blog;
  // });

  const getCurrentUserBlogs = async () => {
    setLoader(true);
    try {
      const response = await currentUserBlogs();
      console.log(" response:",response);
      setBlogs(response?.userBlogs); // Assuming your API returns an object with a 'data' property containing the array of blogs
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false); // Set loader to false after fetching
    }
  };

  useEffect(() => {
    getCurrentUserBlogs();
  }, []);

  const { userId } = useParams();

  return (
    <>
      {loader ? (
        <Loader /> // Show loader while fetching blogs
      ) : (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Your Blogs
            </h1>
            <NavLink
              to="/create-blog"
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Blog
            </NavLink>
            {/* <button className="flex items-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200">
              <Plus className="h-5 w-5 mr-2" />
              New Blog
            </button> */}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
              >
                <div className="md:flex">
                  <div className="object-cover w-full md:w-1/3 flex justify-center md:flex-shrink-0">
                    <img
                      className="w-full object-cover"
                      src={blog.image}
                      alt={blog.title}
                    />
                  </div>
                  <div className="p-6 w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                          {blog.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {blog.description}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(blog.createdAt).toLocaleDateString()}{" "}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 cursor-pointer text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition duration-200">
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button className="p-2 cursor-pointer  text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition duration-200">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center flex-wrap justify-between mt-6 space-x-4">
                      <div className="flex items-center flex-wrap gap-4">
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <Heart className="h-5 w-5 text-pink-600 mr-1" />
                          <span>{blog.likes}</span>{" "}
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <MessageCircle className="h-5 w-5 text-green-600 mr-1" />
                          <span>{blog.comments?.length}</span>{" "}
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <Eye className="h-5 w-5 text-blue-600 mr-1" />
                          <span>{blog.views}</span>{" "}
                        </div>
                      </div>
                      <NavLink
                        to={`/blog/${blog._id}`}
                        target="_blank"
                        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 transition duration-200"
                      >
                        <Eye className="h-5 w-5 text-blue-600 mr-1" />
                        <span>View</span>
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            ))} */}
          </div>
        </div>
      )}
    </>
  );
};

export default AllBlogs;
