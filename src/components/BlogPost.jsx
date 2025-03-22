import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Loader from "./Loader.jsx";
import ButtonsLoader from "./ButtonsLoader.jsx";

const BlogPost = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { blogId } = useParams();
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const BLOG_URL =
    import.meta.env.VITE_API_BLOGS_BASE_URL ||
    "http://localhost:3000/api/blogs";
  const COMMENTS_URL =
    import.meta.env.VITE_API_COMMENTS_BASE_URL ||
    "http://localhost:3000/api/comments";

  const getBlog = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BLOG_URL}`);
      setLoading(false);
      const blog = response?.data?.data.find((blog) => blog._id === blogId);
      setSelectedBlog(blog);
      setComments(sortComments(blog.comments || [])); // Initialize comments state
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBlog();
  }, [newComment]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    if (!accessToken) {
      navigate("/login");
      return;
    }

    postComment();
  };

  const postComment = async () => {
    try {
      setCommentLoading(true);
      const response = await axios.post(
        `${COMMENTS_URL}/post-comment`,
        {
          comment: newComment,
          blogId: blogId,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setCommentLoading(false);

      // Assuming the response contains the newly created comment
      const newCommentData = response.data; // Adjust this based on your API response structure

      // Update the comments state with the new comment at the top
      setComments((prevComments) =>
        sortComments([newCommentData, ...prevComments])
      );

      // Clear the comment input after posting
      setNewComment("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const sortComments = (commentsArray) => {
    return commentsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  if (!selectedBlog) {
    return <Loader />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Blog Preview Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <img
          src={selectedBlog.image}
          alt={selectedBlog.title}
          className="w-full h-64 object-cover object-center"
        />
        <div className="p-6">
          <div className="flex items-center mb-4">
            <img
              src={`${selectedBlog.user?.avatar}`}
              alt={selectedBlog.user?.fullName}
              className="w-10 h-10 rounded-full mr-4 object-cover object-center"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {selectedBlog.user?.fullName}
              </p>
              <p className="text-xs text-gray-500">
                Created at:{" "}
                {new Date(selectedBlog.createdAt).toLocaleDateString()} ·{" "}
                {selectedBlog.readTime || "N/A"}
              </p>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {selectedBlog.title}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <span className="flex items-center text-sm text-gray-500">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                    clipRule="evenodd"
                  />
                </svg>
                {selectedBlog.views || 0} views
              </span>
              <span className="flex items-center text-sm text-gray-500">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
                {selectedBlog.likes || 0} likes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Blog Content */}
      <article className="prose lg:prose-xl max-w-none mb-8">
        <p className="mb-6 text-gray-700">{selectedBlog.content}</p>
      </article>

      {/* Author Bio */}
      <div className="my-12 p-6 bg-gray-50 rounded-lg shadow-md">
        <div className="flex items-center">
          <img
            src={`${selectedBlog.user?.avatar}`}
            alt={selectedBlog.user?.name}
            className="w-16 h-16 rounded-full mr-4 object-cover object-center"
          />
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {selectedBlog.user?.fullName}
            </h3>
            <p className="text-gray-600 mt-1">
              Technical Writer & Web Developer
            </p>
          </div>
        </div>
        <p className="mt-4 text-gray-700">
          {/* You can add a bio or description here if available */}
        </p>
      </div>

      {/* Comment Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({selectedBlog.comments?.length})
        </h2>

        {/* Comment Form */}
        <form
          onSubmit={handleAddComment}
          className="mb-8"
          encType="multipart/form-data"
          method="post"
        >
          <textarea
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Add a comment..."
            value={newComment}
            onChange={handleCommentChange}
          ></textarea>
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 cursor-pointer bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {commentLoading ? <ButtonsLoader /> : "Post"}
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="flex space-x-4">
              <img
                src={comment.user?.avatar}
                alt={comment.user?.fullName}
                className="w-10 h-10 rounded-full object-cover object-center"
              />
              <div className="flex-1">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium text-gray-900">
                      {comment.user?.fullName}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString("en-CA")}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.comment}</p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <button className="flex items-center hover:text-blue-600 mr-4">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                    {comment.likes}
                  </button>
                  <button className="hover:text-blue-600">Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
