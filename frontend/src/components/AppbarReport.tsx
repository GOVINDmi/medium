import { useState,useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "./BlogCard";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNotification } from "../hooks";
interface Notif {
  id: number;
  message: string;
  read: boolean;
}

export const AppbarReport = ({blogId}:{blogId : number}) => {
  const [isOpen, setIsOpen] = useState(false);  // Avatar menu
  const [isNotifOpen, setIsNotifOpen] = useState(false);  // Three-dot menu
  const {notifications } = useNotification();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("author");
    localStorage.removeItem("token"); 
    navigate("/signin");
  };

  const handleReport = useCallback(
    async () => {


        try {
            const token = localStorage.getItem("token");
            //console.log(token);
            const response = await axios.post(`${BACKEND_URL}/api/v1/report/${blogId}`, 
                {},  
                {
                  headers: {
                    Authorization: `Bearer ${token}`,  
                  }
                }
              );
              console.log(response);
         
            navigate('/blogs'); 
          } catch (error) {
            console.error("Error reporting blog:", error);
          }
     
    },
    [] 
  );

  return (
    <div className="border-b flex justify-between px-10 py-4">
      <Link to={'/blogs'} className="flex flex-col justify-center cursor-pointer">
        Medium
      </Link>

      <div className="relative flex items-center">
        <Link to={`/publish`}>
          <button
            type="button"
            className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            New
          </button>
        </Link>

        {/* Avatar with Hamburger Menu */}
        <div className="inline-block relative mr-4 mb-2">
          <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            <Avatar size={"big"} name={localStorage.getItem("author") || "A"} />
          </div>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <ul className="py-1">
                <li>
                  <Link
                    to="/myprofile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/notifications"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 relative"
                  >
                    Notifications
                    {notifications.filter((notification: Notif) => !notification.read).length > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        {notifications.filter((notification: Notif) => !notification.read).length}
                      </span>
                    )}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Three Dots Menu for Mark All as Read */}
        <div className="relative mb-2">
          <button
            className="text-gray-700 hover:bg-gray-200 rounded-full p-2 focus:outline-none"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6h.01M12 12h.01M12 18h.01" />
            </svg>
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <ul className="py-1">
                <li>
                  <button
                    onClick={handleReport}
                    className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                  >
                    Report
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
