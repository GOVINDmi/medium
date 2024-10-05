import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../config";
import axios from "axios";
import {  useProfile } from "../hooks";
import { useProfileBlogs } from "../hooks";

import { BlogSkeleton } from "../components/BlogSkeleton";
import { BlogCard} from "../components/BlogCard"; 
import { AppbarNotification } from "../components/AppbarNotification";



export const ProfilePage = () => {
    const { id } = useParams(); // Extract the author id from the URL
    const { loading, profileBlogs } = useProfileBlogs({ id });
    const {profileData , loading1 , setRerender} = useProfile({id})

    // const [profileData, setProfileData] = useState<ProfileData>({
    //     name: "",
    //     followers: 0,
    //     following: 0,
    //     isFollowing: false
    // });
    // const [loading1, setLoading1] = useState(true); // Indicates whether profile data is still loading
    // const [rerender, setRerender] = useState(false);
   

    // useEffect(() => {
    //     async function fetchProfileData() {
    //         try {
    //             const response = await axios.get(`${BACKEND_URL}/api/v1/profile/${id}`, {
    //                 headers: {
    //                     Authorization: localStorage.getItem("token")
    //                 },
    //             });
    //             setProfileData(response.data);
    //             setLoading1(false);
    //         } catch (error) {
    //             console.error("Error fetching profile data", error);
    //             setLoading1(false);
    //         }
    //     }

    //     fetchProfileData();
    // }, [rerender, id]);

    const handleFollow = useCallback(
        async (authorId: number) => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("No token found");
                    return;
                }

                const response = await axios.post(`${BACKEND_URL}/api/v1/followers/follow/${authorId}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setRerender((prev) => !prev); // Trigger a re-render
                } else {
                    console.error("Failed to follow user, unexpected status code:", response.status);
                }
            } catch (error) {
                console.error("Failed to follow user", error);
            }
        },
        [setRerender] // Dependencies for the useCallback
    );

    // useCallback hook for handleUnfollow function
    const handleUnfollow = useCallback(
        async (authorId: number) => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("No token found");
                    return;
                }

                const response = await axios.delete(`${BACKEND_URL}/api/v1/followers/unfollow/${authorId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setRerender((prev) => !prev); // Trigger a re-render
                } else {
                    console.error("Failed to unfollow user, unexpected status code:", response.status);
                }
            } catch (error) {
                console.error("Failed to unfollow user", error);
            }
        },
        [setRerender] // Dependencies for the useCallback
    );

    return (

        <div className="p-4">
            <AppbarNotification/>

            {loading1 ? (
                <div className="h-24 w-full"> {/* Placeholder for name, followers, and following */}
                   
                </div>
            ) : (
                <>
                    <h1 className="text-2xl font-semibold">{profileData.name}</h1>
                    <div className="text-sm text-slate-500">Followers: {profileData.followers}</div>
                    <div className="text-sm text-slate-500">Following: {profileData.following}</div>

                    {profileData.isFollowing ? (
                        <button
                            className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={(e) => {
                                e.preventDefault();
                                handleUnfollow(Number(id));
                            }}
                        >
                            Unfollow
                        </button>
                    ) : (
                        <button
                            className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={(e) => {
                                e.preventDefault();
                                handleFollow(Number(id));
                            }}
                        >
                            Follow
                        </button>
                    )}
                </>
            )}

            {/* Blogs Section */}
            {loading ? (
                <div className="flex justify-center">
                    <div>
                        <BlogSkeleton />
                        <BlogSkeleton />
                        <BlogSkeleton />
                        <BlogSkeleton />
                        <BlogSkeleton />
                    </div>
                </div>
            ) : (
                <div className="flex justify-center">
                    <div>
                        {profileBlogs.map(blog => (
                            <BlogCard
                                key={blog.id+2}
                                id={blog.id}
                                authorName={blog.author.name}
                                title={blog.title}
                                authorId={blog.authorId}
                                content={blog.content}
                                publishedDate={"2nd Feb 2024"} // This should be dynamic in a real scenario
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};