import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div class="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
