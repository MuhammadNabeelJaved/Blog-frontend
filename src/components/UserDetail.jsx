import React, { useEffect, useState } from "react";
import axios from "axios";

const UserDetails = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/users/${userId}`
        );
        setUser(response.data.data); // Adjust based on your API response structure
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold">User Details</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Total Blogs: {user.blogs.length}</p>
      <p>Total Comments: {user.totalComments}</p>
      <p>Total Likes: {user.totalLikes}</p>
      <p>Current Date: {new Date().toLocaleDateString()}</p>
    </div>
  );
};

export default UserDetails;
