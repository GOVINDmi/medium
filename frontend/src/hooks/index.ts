import { useEffect, useState } from "react"
import axios from "axios";
import { BACKEND_URL } from "../config";
import { getNotifications } from "../getNotification";


export interface Blog {
    "content": string;
    "title": string;
    "id": string;
    "authorId":number
    "author": {
        "name": string;
        "id": number
    }
}

interface Notif{
    id:number,
    message:string,
    read:boolean
}

interface Follow{
    id:number,
    followerId:number,
    followingId:number
}


interface ProfileData {
    name: string;
    followers: number;
    following: number;
    isFollowing: boolean;
}


export const useBlog = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog>();

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                setBlog(response.data.blog);
                setLoading(false);
            })
    }, [id])

    return {
        loading,
        blog
    }

}
export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                
                setBlogs(response.data.blogs);
                setLoading(false);
            })
    }, [])
     
    return {
        loading,
        blogs
    }
}


export const useMyBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [myBlogs, setMyBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/myblog`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                setMyBlogs(response.data.blogs);
                setLoading(false);
            })
    }, [])
    
    return {
        loading,
        myBlogs
    }
}



export const useProfileBlogs = ({id} :{id:string | undefined}) => {
    const [loading, setLoading] = useState(true);
    const [profileBlogs, setProfileBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/profile/${id}`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                setProfileBlogs(response.data.blogs);
                setLoading(false);
            })
    }, [])
    
    return {
        loading,
        profileBlogs
    }
}

export const useNotification = () => {
    const [notifications, setNotifications] = useState<Notif[]>([]);
    const [loading, setLoading] = useState(true);
   
  
    useEffect(() => {
      const fetchNotifications = async () => {
        const notifications = await getNotifications();
        setNotifications(notifications);
        setLoading(!loading);
        
      };
      fetchNotifications();
    }, []);

    return{
        loading,
        notifications,
        setNotifications

    }
}


export const useFollowing = () => {
    const [following, setFollowing] = useState<number[]>([]);
  
    useEffect(() => {
      const fetchFollowing = async () => {
        try {
          const token = localStorage.getItem("token");
  
          if (!token) {
            console.error("No token found");
            return;
          }
  
          const response = await axios.get(`${BACKEND_URL}/api/v1/followers/following`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          // Use the updated response format for fetching the following list
          const followingAuthors = response.data.followers.map((follow: Follow) => follow.followingId);
          setFollowing(followingAuthors);
  
        } catch (error) {
          console.error("Failed to fetch following list", error);
        }
      };
  
      fetchFollowing();
    }, []);
  
    return {
      following,
    };
  };
  


  export const useProfile = ({ id }: { id: string | undefined }) => {
    const [profileData, setProfileData] = useState<ProfileData>({
      name: "",
      followers: 0,
      following: 0,
      isFollowing: false,
    });
    const [loading1, setLoading1] = useState(true);
    const [rerender, setRerender] = useState(false);
  
    useEffect(() => {
      async function fetchProfileData() {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/v1/profile/${id}`, {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          });
  
          // Updated structure based on new schema
          const { name, followers, following, isFollowing } = response.data;
          setProfileData({ name, followers, following, isFollowing });
          setLoading1(false);
        } catch (error) {
          console.error("Error fetching profile data", error);
          setLoading1(false);
        }
      }
  
      fetchProfileData();
    }, [rerender, id]);
  
    return {
      profileData,
      loading1,
      setLoading1,
      rerender,
      setRerender,
    };
  };
  
  export const useMyProfile = () => {
    const [profileData, setProfileData] = useState<ProfileData>({
      name: "",
      followers: 0,
      following: 0,
      isFollowing: false,
    });
    const [loading1, setLoading1] = useState(true);
    const [rerender, setRerender] = useState(false);
  
    useEffect(() => {
      async function fetchProfileData() {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/v1/profile/myprofile`, {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          });
  
          // Updated structure for the logged-in user profile
          const { name, followers, following } = response.data;
          setProfileData({ name, followers, following, isFollowing: false }); // isFollowing is false for own profile
          setLoading1(false);
        } catch (error) {
          console.error("Error fetching profile data", error);
          setLoading1(false);
        }
      }
  
      fetchProfileData();
    }, [rerender]);
  
    return {
      profileData,
      loading1,
      setLoading1,
      rerender,
      setRerender,
    };
  };
  
  