import  {  useCallback} from 'react';
import axios from 'axios';

import { AppbarNotifiHandle } from '../components/AppbarNotifiHandle';

import { Spinner } from '../components/Spinner';
import { BACKEND_URL } from "../config";
import { useNotification } from '../hooks';
import { Notif } from '../hooks';
const NotificationsPage = () => {
    const {loading,notifications,setNotifications } = useNotification();
  
//   const [notifications, setNotifications] = useState<Notif[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       const notifications = await getNotifications();
//       setNotifications(notifications);
//       setLoading(!loading);
//     };
//     fetchNotifications();
//   }, []);

const handleMarkAsRead = useCallback(
    async (createdAt: Date) => {
      try {
        const token = localStorage.getItem("token"); // Ensure token is retrieved before use
  
        const response = await axios.patch(
          `${BACKEND_URL}/api/v1/notifications/${createdAt}`,
          { read: true },
          {
            headers: {
              Authorization: token, // Add "Bearer " prefix to the token
            },
          }
        );
  
        if (response.status === 200) {
          setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
              notification.createdAt === createdAt
                ? { ...notification, read: true }
                : notification
            )
            
          );
          
        } else {
          console.error("Error marking notification as read:", createdAt);
        }
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    },
    [] // Dependencies of the useCallback
  );
  if (loading) {
    return <div>


    <div className="h-screen flex flex-col justify-center">
        
        <div className="flex justify-center">
            <Spinner />
        </div>
    </div>
</div>
  }

  return (
    <div>
        <AppbarNotifiHandle  notifications={notifications} setNotifications = {setNotifications}/>
      <h1>Notifications</h1>
      <ul>
        {notifications.map((notification:Notif) => (
          <li key={notification.id+3}>
            <p>{notification.message}</p>
            {notification.read ? (
                <div>Notification has been read</ div>
                ) : (
                <button onClick={() => handleMarkAsRead(notification.createdAt)}>
                    Mark as read
                </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPage;