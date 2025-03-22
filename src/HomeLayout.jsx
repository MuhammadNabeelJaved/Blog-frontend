// src/layout.jsx
import React from "react";
import { Outlet } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Layout = () => {
  return (
    <>
      <Navbar /> {/* Add padding-top to avoid overlap with Navbar */}
      <main className="w-100%">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default Layout;
