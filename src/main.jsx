import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// Dynamic imports for better performance
const Home = React.lazy(() => import("./components/Home.jsx"));
const Team = React.lazy(() => import("./components/Team.jsx"));
const Projects = React.lazy(() => import("./components/Projects.jsx"));
const CreateBlog = React.lazy(() => import("./components/CreateBlog.jsx"));
const Calendar = React.lazy(() => import("./components/Calender.jsx"));
const Layout = React.lazy(() => import("./HomeLayout.jsx"));
const Login = React.lazy(() => import("./components/Login.jsx"));
const UserDashboard = React.lazy(() => import("./components/Dashboard.jsx"));
const BlogPost = React.lazy(() => import("./components/BlogPost.jsx"));
const Loader = React.lazy(() => import("./components/Loader.jsx"));
const Signup = React.lazy(() => import("./components/SignUp.jsx"));
const Inbox = React.lazy(() => import("./components/Inbox.jsx"));
const AllBlogs = React.lazy(() => import("./components/AllBlogs.jsx"));
const ProtectedRoute = React.lazy(() => import("./authentication/ProtectedRoute.jsx"));

import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { AuthProvider } from "./authentication/Auth.jsx";

// Error Boundary Component
function ErrorBoundary() {
  return (
    <div>
      <h1>Oops! Something went wrong</h1>
      <Navigate to="/" replace />
    </div>
  );
}

// Create router with Layout as the parent route and protected routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      { 
        index: true, 
        element: <Home /> 
      },
      { 
        path: "login", 
        element: <Login /> 
      },
      { 
        path: "register", 
        element: <Signup /> 
      },
      { 
        path: "team", 
        element: <Team /> 
      },
      { 
        path: "projects", 
        element: <Projects /> 
      },
      { 
        path: "blog/:blogId", 
        element: <BlogPost /> 
      },
      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          { 
            path: "calendar", 
            element: <Calendar /> 
          },
          { 
            path: "create-blog", 
            element: <CreateBlog /> 
          },
          // User Dashboard routes
          {
            path: "dashboard/user/:userId",
            element: <UserDashboard />,
            children: [
              // Uncomment if needed
              // { path: "inbox", element: <Inbox /> },
              // { path: "blogs", element: <AllBlogs /> },
            ],
          },
        ],
      },
      // Catch-all route to handle 404
      { 
        path: "*", 
        element: <Navigate to="/" replace /> 
      }
    ],
  },
]);

// Render the app with RouterProvider wrapped in AuthProvider and Suspense for loading state
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <Suspense fallback={<Loader />}>
        <RouterProvider router={router} />
      </Suspense>
    </AuthProvider>
  </React.StrictMode>
);