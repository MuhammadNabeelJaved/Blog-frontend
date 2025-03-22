import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./components/Home.jsx";
import Team from "./components/Team.jsx";
import Projects from "./components/Projects.jsx";
import CreateBlog from "./components/CreateBlog.jsx";
import Calendar from "./components/Calender.jsx";
import Layout from "./HomeLayout.jsx";
import { createBrowserRouter, RouterProvider } from "react-router"; // Fixed import
import { AuthProvider } from "./authentication/Auth.jsx";
import ProtectedRoute from "./authentication/ProtectedRoute.jsx";
import Login from "./components/Login.jsx";
import UserDashboard from "./components/Dashboard.jsx";
import BlogPost from "./components/BlogPost.jsx";
import Loader from "./components/Loader.jsx";
import Signup from "./components/SignUp.jsx";
import Inbox from "./components/Inbox.jsx";
import AllBlogs from "./components/AllBlogs.jsx";

// Create router with Layout as the parent route and protected routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Signup /> },
      { path: "team", element: <Team /> },
      { path: "projects", element: <Projects /> },
      { path: "blog/:blogId", element: <BlogPost /> },

      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          { path: "calendar", element: <Calendar /> },
          { path: "create-blog", element: <CreateBlog /> },

          // User Dashboard routes - set up as a parent/child hierarchy
          {
            path: "dashboard/user/:userId",
            element: <UserDashboard />,
            children: [
              // { path: "dashboard/user/:userId/inbox", element: <Inbox /> },
              // { path: "dashboard/user/:userId/blogs", element: <AllBlogs /> },
            ],
          },
        ],
      },
    ],
  },
]);

// Render the app with RouterProvider wrapped in AuthProvider and Suspense for loading state
createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  </AuthProvider>
);
