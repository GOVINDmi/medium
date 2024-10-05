import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "./BlogCard";

import { useNotification } from "../hooks";

interface Notif{
    id:number,
    message:string,
    read:boolean
}

export const AppbarNotification = () => {
    const {notifications } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("author");
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/signin");
  };

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       const notifications = await getNotifications();
//       setNotifications(notifications);
//     };
//     fetchNotifications();
//   }, []);

//   const handleMarkAsRead = async (notificationId) => {
//     try {
//       // Make a request to mark the notification as read
//       // For now, we'll just update the local state
//       setNotifications((prevNotifications) =>
//         prevNotifications.map((notification) =>
//           notification.id === notificationId
//             ? { ...notification, read: true }
//             : notification
//         )
//       );
//     } catch (error) {
//       console.error("Error marking notification as read:", error);
//     }
//   };

  return (
    <div className="border-b flex justify-between px-10 py-4">
      <Link to={'/blogs'} className="flex flex-col justify-center cursor-pointer">
        Medium
      </Link>
      <div className="relative">
        <Link to={`/publish`}>
          <button
            type="button"
            className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            New
          </button>
        </Link>

        {/* Avatar with Hamburger Menu */}
        <div className="inline-block relative">
          <div 
            className="cursor-pointer" 
            onClick={() => setIsOpen(!isOpen)}
          >
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
                    {notifications.filter((notification:Notif) => !notification.read).length > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        {notifications.filter((notification:Notif) => !notification.read).length}
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
      </div>
    </div>
  );
};