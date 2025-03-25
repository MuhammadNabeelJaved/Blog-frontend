import React, { useState } from "react";
import { useParams, useLocation, Outlet, useNavigate } from "react-router"; // Fixed import
import {
  Menu,
  LogOut,
  User,
  BookOpen,
  Home,
  MessageSquare,
  X
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!userId) {
    return <div>User ID not found</div>;
  }

  const passValueselectedItem = (data) => {
    setSelectedItem(data);
    // Close sidebar on mobile when item is selected
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile header with menu button */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 md:hidden shadow-sm">
        <div className="flex items-center">
          <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="ml-2 text-lg font-semibold text-blue-800 dark:text-white">
            User Portal
          </h2>
        </div>
        <button
          type="button"
          className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar - fixed on mobile, permanent on desktop */}
      <div 
        className={`${
          sidebarOpen ? 'fixed inset-0 z-50 bg-gray-900 bg-opacity-50' : 'hidden'
        } md:block md:relative md:inset-auto md:bg-transparent md:z-auto`}
        onClick={(e) => {
          // Close sidebar when clicking outside on mobile
          if (e.target === e.currentTarget) toggleSidebar();
        }}
      >
        <aside
          className={`w-64 h-full md:h-screen transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } transition-transform duration-300 ease-in-out`}
        >
          <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800 shadow-lg md:shadow-none">
            {/* Close button visible only on mobile */}
            <div className="flex items-center justify-between mb-5 md:hidden">
              <div className="flex items-center p-2 bg-blue-50 dark:bg-gray-700 rounded-lg">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h2 className="ml-2 text-lg font-semibold text-blue-800 dark:text-white">
                  User Portal
                </h2>
              </div>
              <button
                type="button"
                className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none"
                onClick={toggleSidebar}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User portal header for desktop */}
            <div className="hidden md:flex items-center justify-center mb-5 p-2 bg-blue-50 dark:bg-gray-700 rounded-lg">
              <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h2 className="ml-2 text-xl font-semibold text-blue-800 dark:text-white">
                User Portal
              </h2>
            </div>

            <ul className="space-y-2 font-medium">
              <li
                onClick={() => passValueselectedItem("dashboard")}
                className={`cursor-pointer rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 ${
                  selectedItem === "dashboard" ? "bg-gray-200 dark:bg-gray-700" : ""
                }`}
              >
                <div className="flex items-center p-2 text-gray-900 dark:text-white group">
                  <Home className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="ms-3">Dashboard</span>
                </div>
              </li>
              <li
                onClick={() => passValueselectedItem("blogs")}
                className={`cursor-pointer rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 ${
                  selectedItem === "blogs" ? "bg-gray-200 dark:bg-gray-700" : ""
                }`}
              >
                <div className="flex items-center p-2 text-gray-900 dark:text-white group">
                  <BookOpen className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="flex-1 ms-3 whitespace-nowrap">All Blogs</span>
                </div>
              </li>
              <li
                onClick={() => passValueselectedItem("inbox")}
                className={`cursor-pointer rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 ${
                  selectedItem === "inbox" ? "bg-gray-200 dark:bg-gray-700" : ""
                }`}
              >
                <div className="flex items-center p-2 text-gray-900 dark:text-white group">
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
                  className="flex cursor-pointer items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group"
                >
                  <LogOut className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="flex-1 ms-3 whitespace-nowrap">Sign Out</span>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-4 w-full overflow-auto">
        <div className="border-gray-200 rounded-lg dark:border-gray-700 w-full">
          {/* Render the appropriate component based on the current selection */}
          {selectedItem === "dashboard" ? (
            <DashboardHome />
          ) : selectedItem === "blogs" ? (
            <AllBlogs />
          ) : selectedItem === "inbox" ? (
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
