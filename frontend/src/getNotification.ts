import axios from "axios";
import { BACKEND_URL } from "./config";

// Fetch notifications from the backend
export const getNotifications = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/v1/notifications`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    return response.data.notifications; // Assuming your backend returns notifications in `response.data.notifications`
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};
