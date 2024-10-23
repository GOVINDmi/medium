import axios from "axios";
import { BACKEND_URL } from "./config";
import { requestFirebaseToken } from './firebase';

const vapidKey = 'BElxWcZZE_DrCX4rmoRbMuY2FUyj-0nPv62rB_rEgUGtlqNk6VA-VtX6gvNTmCskg2z6z-cX8_1pgrOqeewrAA0';

// Fetch notifications from the backend
export const getNotifications = async () => {
  try {
    const token =  await requestFirebaseToken(vapidKey);
    
   
    const response = await axios.get(`${BACKEND_URL}/api/v1/notifications/${token}`, {
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
