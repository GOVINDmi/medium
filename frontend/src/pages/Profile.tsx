import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useProfile } from "../hooks";
import { useProfileBlogs } from "../hooks";

import { BlogSkeleton } from "../components/BlogSkeleton";
import { BlogCard } from "../components/BlogCard";
import { AppbarNotification } from "../components/AppbarNotification";

export const ProfilePage = () => {
    const { id } = useParams(); // Extract the author id from the URL
    const { loading, profileBlogs } = useProfileBlogs({ id });
    const { profileData, loading1, setRerender } = useProfile({ id });

    // Follow user callback
    const handleFollow = useCallback(
        async (authorId: number) => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("No token found");
                    return;
                }

                const response = await axios.post(
                    `${BACKEND_URL}/api/v1/followers/follow/${authorId}`, 
                    {}, 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 200) {
                    setRerender((prev) => !prev); // Trigger a re-render to update the profile UI
                } else {
                    console.error("Failed to follow user, unexpected status code:", response.status);
                }
            } catch (error) {
                console.error("Failed to follow user", error);
            }
        },
        [setRerender]
    );

    // Unfollow user callback
    const handleUnfollow = useCallback(
        async (authorId: number) => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("No token found");
                    return;
                }

                const response = await axios.delete(
                    `${BACKEND_URL}/api/v1/followers/unfollow/${authorId}`, // Using `followingId` in the URL or body as needed
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 200) {
                    setRerender((prev) => !prev); // Trigger a re-render to update the profile UI
                } else {
                    console.error("Failed to unfollow user, unexpected status code:", response.status);
                }
            } catch (error) {
                console.error("Failed to unfollow user", error);
            }
        },
        [setRerender]
    );

    return (
        <div className="p-4">
            <AppbarNotification />

            {/* Profile Header Section */}
            {loading1 ? (
                <div className="h-24 w-full">
                    {/* Placeholder for name, followers, and following */}
                </div>
            ) : (
                <>
                    <h1 className="text-2xl font-semibold">{profileData.name}</h1>
                    <div className="text-sm text-slate-500">Followers: {profileData.followers}</div>
                    <div className="text-sm text-slate-500">Following: {profileData.following}</div>

                    {/* Follow/Unfollow Button */}
                    {profileData.isFollowing ? (
                        <button
                            className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={(e) => {
                                e.preventDefault();
                                handleUnfollow(Number(id)); // Trigger unfollow with author ID
                            }}
                        >
                            Unfollow
                        </button>
                    ) : (
                        <button
                            className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={(e) => {
                                e.preventDefault();
                                handleFollow(Number(id)); // Trigger follow with author ID
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
                        {profileBlogs.map((blog) => (
                            <BlogCard
                                key={blog.id + 2}
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
