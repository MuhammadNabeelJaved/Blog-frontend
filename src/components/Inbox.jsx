import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { User, Clock, MessageCircle } from "lucide-react";

const Inbox = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Sarah Johnson",
      subject: "Comments on your latest blog post",
      message: "Hi, I really enjoyed your article on React hooks. Would you consider writing a follow-up on custom hooks?",
      date: "2023-03-15T10:30:00",
      read: true
    },
    {
      id: 2,
      sender: "Michael Chen",
      subject: "Collaboration opportunity",
      message: "Hello, I'm working on a project that aligns with your expertise. Would you be interested in collaborating?",
      date: "2023-03-14T15:45:00",
      read: false
    },
    {
      id: 3,
      sender: "Emily Davis",
      subject: "Question about your CSS techniques",
      message: "I tried implementing the technique you described in your CSS article, but I'm running into some issues. Could you clarify how to handle responsive breakpoints?",
      date: "2023-03-12T09:15:00",
      read: false
    }
  ]);

  // In a real application, you would fetch messages here
  useEffect(() => {
    // Example fetch call (commented out)
    // fetch(`/api/users/${userId}/messages`)
    //   .then(response => response.json())
    //   .then(data => setMessages(data));
  }, [userId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Inbox</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ${
                !message.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="rounded-full bg-gray-200 dark:bg-gray-600 p-2 mr-3">
                    <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-white">{message.sender}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{message.subject}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(message.date).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-2 pl-10">
                <p className="text-gray-600 dark:text-gray-300">{message.message}</p>
              </div>
              <div className="mt-3 pl-10 flex justify-between">
                <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  Reply
                </button>
                {!message.read && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    New
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inbox;