// src/pages/Home.jsx
import React from "react";
import BlogCard from "../components/BlogCard";

const Home = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center mt-8">Latest Blogs</h1>
      <BlogCard />
    </div>
  );
};

export default Home;