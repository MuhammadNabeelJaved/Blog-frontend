import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router"; // Import useNavigate for redirection
import ButtonsLoader from "./ButtonsLoader.jsx";

const CreateBlog = () => {
  const [loading, setLoading] = useState(false); // State to manage loading
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const navigate = useNavigate(); // Hook for navigation

  const publishBlog = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target); // Create a FormData object from the form
    const accessToken = localStorage.getItem("accessToken"); // Get the token from localStorage

    // Validation checks
    const title = formData.get("title");
    const description = formData.get("description");

    if (title.length > 70) {
      setErrorMessage("Title must be 70 characters or less.");
      return;
    }

    if (description.length > 300) {
      setErrorMessage("Description must be 300 characters or less.");
      return;
    }

    setLoading(true); // Set loading to true when starting the request
    setErrorMessage(""); // Clear previous error messages

    try {
      const response = await axios.post(
        `http://localhost:3000/api/blogs/create-blog`, // URL for the POST request
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type for file uploads
            Authorization: `Bearer ${accessToken}`, // Include the token in the headers
          },
        }
      );

      console.log(response.data);
      setSuccessMessage("Blog published successfully!"); // Set success message
      setTimeout(() => {
        navigate(`/user/dashboard/${response.data?.data?.user}`); // Redirect to dashboard after 2 seconds
      }, 2000);
    } catch (error) {
      console.log(error);
      setSuccessMessage(""); // Clear success message on error
      setErrorMessage("Failed to publish blog."); // Set error message
    } finally {
      setLoading(false); // Set loading to false after the request is complete
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Blog Post</h1>
      {successMessage && ( // Show success message if it exists
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {errorMessage && ( // Show error message if it exists
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {errorMessage}
        </div>
      )}
      <form
        onSubmit={publishBlog}
        encType="multipart/form-data"
        method="post"
        className="max-w-3xl mx-auto"
      >
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter blog title"
            name="title"
            required // Make this field required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-bold mb-2"
          >
            Description
          </label>
          <input
            id="description"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter blog description"
            name="description"
            required // Make this field required
          />
        </div>

        <label htmlFor="file-input" className="sr-only">
          Choose file
        </label>
        <input
          type="file"
          name="image"
          id="file-input"
          className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none
            file:bg-gray-50 file:border-0
            file:me-4
            file:py-3 file:px-4
          "
          required // Make this field required
        />

        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-gray-700 font-bold mb-2"
          >
            Content
          </label>
          <textarea
            id="content"
            rows="10"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your blog content here..."
            name="content"
            required // Make this field required
          ></textarea>
        </div>
        <button
          type="submit" // Use type="submit" to trigger form submission
          className="bg-blue-700 text-white px-6 py-2 cursor-pointer rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading} // Disable button while loading
        >
          {loading ? <ButtonsLoader /> : "Publish Blog"}{" "}
          {/* Show loading text */}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
