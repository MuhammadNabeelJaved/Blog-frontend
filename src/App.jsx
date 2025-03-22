import dotenv from "dotenv";
import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import BlogCard from "./components/BlogCard.jsx";
import { Outlet } from "react-router";
import Layout from "./HomeLayout.jsx";

dotenv.config();

function App() {
  console.log("Use Api Base URL: ",import.meta.env.VITE_API_USERS_BASE_URL)
  console.log("Comments Api Base URL: ", import.meta.env.VITE_API_USERS_BASE_URL)
  
  return (
    <div className="app">
      <Layout />
    </div>
  );
}

export default App;
