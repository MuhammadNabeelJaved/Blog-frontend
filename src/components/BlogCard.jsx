import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router";
import Loader from "./Loader.jsx";
import { getBlogs } from "../api/blog.api.js";

const BlogCard = () => {
  const [blog, setBlog] = useState([]);
  const [loader, setLoader] = useState(false);

  const getBlog = async () => {
    setLoader(true);
    try {
      setLoader(true);
      const response = await getBlogs();
      // if (!response.ok) {
      //   return <h1 className="m-auto">No Blogs found!</h1>;
      // }
      setBlog(response); // Assuming your API returns an object with a 'data' property containing the array of blogs
      setLoader(false);
    } catch (error) {
      console.log(error);
    }
    // setLoader(false);
  };

  useEffect(() => {
    getBlog();
  }, []);

  if (blog.length === 0) {
    return <h1 className="m-auto">No Blogs found!</h1>;
  }
  if (loader) {
    return <Loader />;
  }

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <div className="flex flex-wrap justify-center gap-4 m-12 sm:gap-8 sm:mt-8 lg:gap-12 lg:mt-12 xl:gap-16 xl:mt-16">
          {blog.map((blog) => (
            <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <div className="relative h-56 center overflow-hidden rounded-t-lg border border-gray-200 bg-gray-200 dark:bg-gray-700">
                <img
                  className="rounded-t-lg object-cover center w-full "
                  src={`${blog.image}`}
                  alt=""
                />
              </div>
              <div className="p-5">
                <a href="#">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {blog.title}
                  </h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {blog.description}
                </p>
                <NavLink
                  to={`/blog/${blog._id}`}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Read more
                  <svg
                    className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default BlogCard;
