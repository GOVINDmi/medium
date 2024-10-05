import { AppbarNotification } from "../components/AppbarNotification";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import { Blog } from "../hooks";

export const UpdateBlog = ({ blog }: { blog: Blog }) => {
  // Initialize title and description with the blog values
  const [title, setTitle] = useState(blog.title || "");
  const [description, setDescription] = useState(blog.content || "");
  const navigate = useNavigate();

  const handlePublish = useCallback(async () => {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/v1/blog`,
        {
          title,
          content: description,
          id: blog.id,
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
  }, [title, description, blog.id]);
  return (
    <div>
      <AppbarNotification />
      <div className="flex justify-center w-full pt-8">
        <div className="max-w-screen-lg w-full">
          {/* Controlled input with title */}
          <input
            onChange={(e) => setTitle(e.target.value)}  // Update title state
            type="text"
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5"
            value={title}  // Use title state as value
          />

          {/* TextEditor for description */}
          <TextEditor onChange={(e) => setDescription(e.target.value)} description={description} />

          <button
            onClick={handlePublish}
            type="submit"
            className="mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

// Simple TextEditor component
function TextEditor({ onChange, description }: { onChange: (e: any) => void, description: string }) {
  return (
    <div className="mt-2">
      <div className="w-full mb-4">
        <div className="flex items-center justify-between border">
          <div className="my-2 bg-white rounded-b-lg w-full">
            <label className="sr-only">Update</label>
            <textarea
              onChange={onChange}  // Update description state
              id="editor"
              rows={8}
              className="focus:outline-none block w-full px-0 text-sm text-gray-800 bg-white border-0 pl-2"
              value={description}  // Use description state as value
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
}
