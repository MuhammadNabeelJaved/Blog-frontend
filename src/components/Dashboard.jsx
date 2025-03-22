import React, { useState } from "react";
import { useParams, useLocation, Outlet, useNavigate } from "react-router"; // Fixed import
import {
  Menu,
  LogOut,
  User,
  BookOpen,
  Home,
  MessageSquare,
} from "lucide-react";

// Import your component views
import DashboardHome from "./DashboardHome";
import AllBlogs from "./AllBlogs";
import Inbox from "./Inbox";
import { useAuth } from "../authentication/Auth.jsx";

const UserDashboard = () => {
  const location = useLocation();
  const { userId } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState("dashboard");

  if (!userId) {
    return <div>User ID not found</div>;
  }

  const passValueselectedItem = (data) => {
    setSelectedItem(data);
  };

  const logoutUser = () => {
    // Your logout logic here
    logout();
    navigate("/login");
  };

  // // Helper function to determine which component to render
  // const renderDashboardContent = () => {
  //   const path = location.pathname;

  //   // Check which path is active and render the appropriate component
  //   if (path.endsWith(`/dashboard/user/${userId}/blogs`)) {
  //     return <AllBlogs />;
  //   } else if (path.endsWith(`/dashboard/user/${userId}/inbox`)) {
  //     return <Inbox />;
  //   } else {
  //     // Default to dashboard home
  //     return <DashboardHome />;
  //   }
  // };

  return (
    <div className="flex bg-gray-100 justify-space-between dark:bg-gray-900">
      {/* Mobile menu button */}
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        id="default-sidebar"
        className="relative left-0 z-40 w-64 transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-center mb-5 p-2 bg-blue-50 dark:bg-gray-700 rounded-lg">
            <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h2 className="ml-2 text-xl font-semibold text-blue-800 dark:text-white">
              User Portal
            </h2>
          </div>

          <ul className="space-y-2 font-medium">
            <li
              onClick={() => passValueselectedItem("dashboard")}
              className={`cursor-pointer hover:bg-gray-200 ${
                selectedItem === "dashboard" ? "bg-gray-200" : ""
              }`}
            >
              <div
                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
                end // This ensures this link is active only on exact match
              >
                <Home className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ms-3">Dashboard</span>
              </div>
            </li>
            <li
              onClick={() => passValueselectedItem("blogs")}
              className={`cursor-pointer hover:bg-gray-200 ${
                selectedItem === "blogs" ? "bg-gray-200" : ""
              }`}
            >
              <div
                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
              >
                <BookOpen className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">All Blogs</span>
              </div>
            </li>
            <li
              onClick={() => passValueselectedItem("inbox")}
              className={`cursor-pointer hover:bg-gray-200 ${
                selectedItem === "inbox" ? "bg-gray-200" : ""
              }`}
            >
              <div
                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}
              >
                <MessageSquare className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
                <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                  3
                </span>
              </div>
            </li>
            <li>
              <div
                onClick={logoutUser}
                className="flex cursor-pointer items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <LogOut className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">Sign Out</span>
              </div>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main content area */}
      <div className="p-4 w-full h-100%">
        <div className="border-gray-200 rounded-lg dark:border-gray-700 w-full h-full">
          {/* Render the appropriate component based on the current route */}
          {selectedItem === "dashboard" ? (
            <DashboardHome />
          ) : null || selectedItem === "blogs" ? (
            <AllBlogs />
          ) : null || selectedItem === "inbox" ? (
            <Inbox />
          ) : null}

          {/* We can keep Outlet for any nested routes */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
