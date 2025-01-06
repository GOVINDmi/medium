import React, { useState } from "react";
import { BannerUploader } from "../components/BannerUploader";
import { TopicsInput } from "../components/TopicsInput";
import { BlogEditor } from "../components/BlogEditor";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { AppbarNotification } from "../components/AppbarNotification";

export const Publish: React.FC = () => {
  const [bannerImageUrl, setBannerImageUrl] = useState<string>("");
  const [content, setContent] = useState<any>(null);
  const [topics, setTopics] = useState<string[]>([]);

  const handlePublish = async () => {
    if (!content || !bannerImageUrl || topics.length === 0) {
      alert("All fields (content, banner image, and topics) are required.");
      return;
    }

    const blogTitle = content.title;

    const blogData = {
      title: blogTitle,
      content:content.content, // Send the Editor.js content directly
      bannerImage: bannerImageUrl,
      topics,
    };

    try {
      const token = localStorage.getItem("token");
      console.log(blogData);
      await axios.post(`${BACKEND_URL}/api/v1/blog`, blogData,{
        
          headers: {
              Authorization: `${token}`,
          },
      
      });
      alert("Blog published successfully!");
    } catch (error) {
      console.error("Error publishing blog:", error);
      alert("Failed to publish blog.");
    }
  };

  return (
   <div>
     <AppbarNotification/>
     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
     
     <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Publish New Blog</h1>
     
     {/* Banner Uploader */}
     <BannerUploader onUpload={setBannerImageUrl} />
     {bannerImageUrl && (
       <img
         src={bannerImageUrl}
         alt="Banner"
         className="w-full rounded-lg mt-4 mb-6 shadow-md"
       />
     )}

     {/* Blog Editor */}
     <BlogEditor onSave={setContent} />
     
     {/* Topics Input */}
     <TopicsInput onChange={setTopics} />
     
     {/* Publish Button */}
     <button
       onClick={handlePublish}
       className="w-full mt-6 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
     >
       Publish Blog
     </button>
   </div>
   </div>
   
  );
};
