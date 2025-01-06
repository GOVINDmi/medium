import { AppbarNotification } from "../components/AppbarNotification";
import { BannerUploader } from "../components/BannerUploader";
import { TopicsInput } from "../components/TopicsInput";
import { BlogEditor } from "../components/BlogEditor";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import { Blog } from "../hooks";

export const UpdateBlog = ({ blog }: { blog: Blog }) => {
  // Initialize states with the blog values
  const [title, setTitle] = useState(blog.title || "");
  const [description, setDescription] = useState(blog.content || "");
  const [bannerImageUrl, setBannerImageUrl] = useState(blog.bannerImage || "");
  const [topics, setTopics] = useState<string[]>(blog.topics || []);
  const navigate = useNavigate();

  const handlePublish = useCallback(async () => {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/v1/blog`,
        {
          title,
          content: description,
          id: blog.id,
          bannerImage: bannerImageUrl,
          topics,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      navigate(`/myprofileblog/${response.data.id}`);
    } catch (error) {
      console.error("Error updating the blog:", error);
    }
  }, [title, description, blog.id, bannerImageUrl, topics]);

  return (
    <div>
      <AppbarNotification />
      <div className="flex justify-center w-full pt-8">
        <div className="max-w-screen-lg w-full">
          {/* Banner Uploader */}
          <div className="mb-6 mt-4">
            {bannerImageUrl ? (
              <div className="relative">
                <img
                  src={bannerImageUrl}
                  alt="Current Banner"
                  className="w-full rounded-lg shadow-md mb-4"
                />
                <button
                  onClick={() => setBannerImageUrl("")}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
                >
                  Remove
                </button>
              </div>
            ) : (
              <BannerUploader onUpload={setBannerImageUrl} />
            )}
          </div>

          {/* Blog Editor */}
          <BlogEditor
            initialTitle={title}
            initialContent={description}
            onSave={({ title, content }) => {
              setTitle(title);
              setDescription(content);
            }}
          />

          {/* Topics Input */}
          <TopicsInput onChange={setTopics} initialTopics={topics} />

          {/* Update Button */}
          <button
            onClick={handlePublish}
            type="submit"
            className="mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-800"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};
