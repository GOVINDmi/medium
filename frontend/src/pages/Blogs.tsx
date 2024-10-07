

import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";

import {AppbarNotification} from "../components/AppbarNotification"





export const Blogs = () => {
  const { loading, blogs } = useBlogs();
 
//   const [following, setFollowing] = useState<Number[]>([]);
//   const [rerender, setRerender] = useState(false);
 // const {following} = useFollowing()

//   useEffect(() => {
//     const fetchFollowing = async () => {
//       try {
//         const token = localStorage.getItem("token");
  
//         if (!token) {
//           console.error("No token found");
//           return;
//         }
  
//         const response = await axios.get(`${BACKEND_URL}/api/v1/followers/following`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
  
//         const followingAuthors = response.data.map((author:Follow) => author.followingId);
//         setFollowing(followingAuthors);
//       } catch (error) {
//         console.error("Failed to fetch following list", error);
//       }
//     };
  
//     fetchFollowing();
//   }, [handleFollow]);
// useEffect(() => {
//     const fetchFollowing = async () => {
//       try {
//         const token = localStorage.getItem("token");
  
//         if (!token) {
//           console.error("No token found");
//           return;
//         }
  
//         const response = await axios.get(`${BACKEND_URL}/api/v1/followers/following`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const followingAuthors = response.data.response.map((author:Follow) => author.followingId);
//         //console.log(followingAuthors);
//          setFollowing(followingAuthors);
//         // console.log(response.data.response);
//         //setFollowing(response.data.response);
//       } catch (error) {
//         console.error("Failed to fetch following list", error);
//       }
//     };
  
//     fetchFollowing();
//   }, [rerender]);
  
//   const handleFollow = async (authorId: number) => {
//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         console.error("No token found");
//         return;
//       }

//       const response = await axios.post(`${BACKEND_URL}/api/v1/followers/follow/${authorId}`, {}, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.status === 200) {
//         setRerender(!rerender);
//         console.log(following);
       
//       } else {
//         console.error("Failed to follow user, unexpected status code:", response.status);
//       }
//     } catch (error) {
//       console.error("Failed to follow user", error);
//     }
//   };

//   const handleUnfollow = async (authorId: number) => {
//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         console.error("No token found");
//         return;
//       }

//       const response = await axios.delete(`${BACKEND_URL}/api/v1/followers/unfollow/${authorId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.status === 200) {
//         setRerender(!rerender);
       
//       } else {
//         console.error("Failed to unfollow user, unexpected status code:", response.status);
//       }
//     } catch (error) {
//       console.error("Failed to unfollow user", error);
//     }
//   };
 

  if (loading) {
    return (
      <div>
        <div className="flex justify-center">
          <div>
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
          </div>
        </div>
      </div>
    );
  }
 //console.log(following);
  return (
    <div>                                                                   
    
      <AppbarNotification />
      <div className="flex justify-center">
        <div>
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id+1}
              id={blog.id}
              authorName={blog.author.name}
              title={blog.title}
              content={blog.content}
              authorId={blog.authorId}
              publishedDate={new Date(blog.createdAt).toLocaleString("en-US", {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })}
            
            />
          ))}
        </div>
      </div>
    </div>
  );
};
