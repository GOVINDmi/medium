import  { useState, useCallback } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; // Firebase storage


export const Publish = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // Content includes text and image URLs
  const navigate = useNavigate();

 
  //if(user)
  //{

    const handleImageUpload = async (file: File) => {
      try {
        const imageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(imageRef, file);
        const imageUrl = await getDownloadURL(imageRef);
  
        setContent((prevContent) => prevContent + `\n<img src="${imageUrl}" alt="Uploaded Image" />\n`);
      } catch (error) {
        console.error("Error uploading the image:", error);
      }
    };
  
    
 // }


  // Image upload handler
  
  const handlePublish = useCallback(async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog`,
        {
          title,
          content, // Send content including image URLs
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      navigate(`/blog/${response.data.id}`);
    } catch (error) {
      console.error("Error publishing the blog:", error);
    }
  }, [title, content]);

  return (
    <div>
      <div className="flex justify-center w-full pt-8">
        <div className="max-w-screen-lg w-full">
          <input
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            placeholder="Title"
          />

          {/* Text editor for blog content */}
          <TextEditor content={content} onChange={(e) => setContent(e.target.value)} />

          {/* File input for image upload */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
            className="mt-4"
          />

          <button
            onClick={handlePublish}
            type="submit"
            className="mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
          >
            Publish Post
          </button>
        </div>
      </div>
    </div>
  );
};

// Simple text editor component
function TextEditor({ content, onChange }: { content: string; onChange: (e: any) => void }) {
  return (
    <div className="mt-2">
      <div className="w-full mb-4">
        <div className="my-2 bg-white rounded-b-lg w-full">
          <label className="sr-only">Publish post</label>
          <textarea
            value={content}
            onChange={onChange}
            id="editor"
            rows={8}
            className="focus:outline-none block w-full px-0 text-sm text-gray-800 bg-white border-0 pl-2"
            placeholder="Write an article..."
            required
          />
        </div>
      </div>
    </div>
  );
}
