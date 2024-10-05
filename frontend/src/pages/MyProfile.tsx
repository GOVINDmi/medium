

import { useMyBlogs, useMyProfile } from "../hooks";

import { BlogSkeleton } from "../components/BlogSkeleton";
import { BlogCardMyProfile } from "../components/BlogCardMyProfile"; 
import { AppbarNotification } from "../components/AppbarNotification";




export const MyProfile = () => {
   
    // const { loading, profileBlogs } = useProfileBlogs({ id });
    const {loading , myBlogs} = useMyBlogs();
    const {profileData , loading1} = useMyProfile()

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

    // const handleFollow = useCallback(
    //     async (authorId: number) => {
    //         try {
    //             const token = localStorage.getItem("token");

    //             if (!token) {
    //                 console.error("No token found");
    //                 return;
    //             }

    //             const response = await axios.post(`${BACKEND_URL}/api/v1/followers/follow/${authorId}`, {}, {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             });

    //             if (response.status === 200) {
    //                 setRerender((prev) => !prev); // Trigger a re-render
    //             } else {
    //                 console.error("Failed to follow user, unexpected status code:", response.status);
    //             }
    //         } catch (error) {
    //             console.error("Failed to follow user", error);
    //         }
    //     },
    //     [setRerender] // Dependencies for the useCallback
    // );

    // // useCallback hook for handleUnfollow function
    // const handleUnfollow = useCallback(
    //     async (authorId: number) => {
    //         try {
    //             const token = localStorage.getItem("token");

    //             if (!token) {
    //                 console.error("No token found");
    //                 return;
    //             }

    //             const response = await axios.delete(`${BACKEND_URL}/api/v1/followers/unfollow/${authorId}`, {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             });

    //             if (response.status === 200) {
    //                 setRerender((prev) => !prev); // Trigger a re-render
    //             } else {
    //                 console.error("Failed to unfollow user, unexpected status code:", response.status);
    //             }
    //         } catch (error) {
    //             console.error("Failed to unfollow user", error);
    //         }
    //     },
    //     [setRerender] // Dependencies for the useCallback
    // );

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
                    {myBlogs.map(blog => <BlogCardMyProfile
                    id={blog.id}
                    authorName={blog.author.name}
                    title={blog.title}
                    content={blog.content}
                    authorId={blog.authorId}
                    publishedDate={"2nd Feb 2024"}
                />)}
                    </div>
                </div>
            )}
        </div>
    );
};