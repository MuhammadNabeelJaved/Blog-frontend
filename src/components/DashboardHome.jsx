import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router";
import { User, MessageCircle, Heart, BookOpen, Calendar } from "lucide-react";
import { useAuth } from "../authentication/Auth.jsx";
import { currentUserBlogs } from "../api/blog.api.js";

const DashboardHome = () => {
  const { currentUser } = useAuth();
  const param = useParams();
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    password: "********",
    totalComments: 48,
    totalLikes: 156,
  });
  const [totalBlogsAndComments, setTotalBlogsAndComments] = useState([]);
  const [loader, setLoader] = useState(true); // Set loader to true initially

  const getCurrentUserBlogs = async () => {
    setLoader(true);
    try {
      const response = await currentUserBlogs();
      setTotalBlogsAndComments(response); // Assuming your API returns an object with a 'data' property containing the array of blogs
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false); // Set loader to false after fetching
    }
  };

  useEffect(() => {
    getCurrentUserBlogs();
  }, []);

  // Create a new Date object
  const date = new Date(currentUser.createdAt);

  // Define options for formatting
  const options = { day: "2-digit", month: "short", year: "numeric" };
  const userSince = new Date(currentUser.createdAt).toLocaleDateString(
    "en-CA",
    options
  );

  // Format the date
  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with zero if needed
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-11) and pad with zero
    const year = date.getFullYear(); // Get full year

    return `${day}-${month}-${year}`; // Format the date
  };

  // In a real application, you would fetch user data here
  useEffect(() => {
    getCurrentDate();
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between bg-blue-100 dark:bg-gray-700 p-6 rounded-lg mb-6">
        <div className="">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
            Welcome back,{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {currentUser.fullName}
            </span>
            !
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Today is {getCurrentDate()}
          </p>
        </div>
        <div className="w-20 h-20 rounded-full overflow-hidden">
          <img
            className="object-cover object-center w-full h-full"
            src={currentUser.avatar}
            alt=""
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 mr-4">
            <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="break-words break-all">
            <p className="text-sm text-gray-500 break-words break-all dark:text-gray-400">
              User ID
            </p>
            <p className="text-xl font-semibold break-words break-all text-gray-800 dark:text-white">
              {currentUser?._id}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3 mr-4">
            <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Blogs
            </p>
            <p className="text-xl font-semibold text-gray-800 dark:text-white">
              {totalBlogsAndComments.userBlogs?.length}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-pink-100 dark:bg-pink-900 p-3 mr-4">
            <Heart className="h-6 w-6 text-pink-600 dark:text-pink-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Likes
            </p>
            <p className="text-xl font-semibold text-gray-800 dark:text-white">
              0
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex items-center">
          <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mr-4">
            <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Comments</p>
            <p className="text-xl font-semibold text-gray-800 dark:text-white">
              {totalBlogsAndComments.totalBlogsComments}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Profile Information
          </h2>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="font-medium text-gray-500 dark:text-gray-400 md:w-1/3">
                Name:
              </span>
              <span className="text-gray-800 dark:text-white">
                {currentUser.fullName}
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="font-medium text-gray-500 dark:text-gray-400 md:w-1/3">
                Email:
              </span>
              <span className="text-gray-800 dark:text-white">
                {currentUser.email}
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="font-medium text-gray-500 dark:text-gray-400 md:w-1/3">
                Password:
              </span>
              <span className="text-gray-800 dark:text-white">
                {currentUser.password}
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center py-2">
              <span className="font-medium text-gray-500 dark:text-gray-400 md:w-1/3">
                Member Since:
              </span>
              <span className="text-gray-800 dark:text-white">{userSince}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3 flex flex-col gap-2 justify-center items-center ">
            <NavLink className={`w-full`} to="/create-blog">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Write New Blog
              </button>
            </NavLink>
            {/* <button
              disabled={true}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              <User className="h-5 w-5 mr-2" />
              Edit Profile
            </button> */}
            <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              View Messages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
