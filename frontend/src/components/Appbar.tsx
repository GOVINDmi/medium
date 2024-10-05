import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "./BlogCard";

export const Appbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("author");
        localStorage.removeItem("token"); // Remove token from localStorage
        navigate("/signin");
    };

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

// export function Avatar({ name, size = "small" }: { name: string, size?: "small" | "big" }) {
//     return (
//         <div 
//             className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-600 rounded-full ${size === "small" ? "w-6 h-6" : "w-10 h-10"} cursor-pointer`}
//         >
//             <span className={`${size === "small" ? "text-xs" : "text-md"} font-extralight text-white`}>
//                 {name[0].toUpperCase()}
//             </span>
//         </div>
//     );
// }
