import React, { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

interface EditorProps {
  initialTitle?: string;
  initialContent?: string;
  onSave: (data: { title: string; content: string }) => void;
}

export const BlogEditor: React.FC<EditorProps> = ({
  initialTitle = "",
  initialContent = "",
  onSave,
}) => {
  const [title, setTitle] = useState<string>(initialTitle);
  const [content, setContent] = useState<string>(initialContent);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
  }, [initialTitle, initialContent]);

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const storageRef = ref(storage, `content-images/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setIsUploading(false);

      // Embed the image as an inline <img> tag
      const cursorPosition = (document.getElementById("contentArea") as HTMLTextAreaElement)
        ?.selectionStart || content.length;
      const updatedContent =
        content.slice(0, cursorPosition) +
        `<img src="${downloadURL}" alt="Uploaded Image" style="max-width: 100%;"/>` +
        content.slice(cursorPosition);
      setContent(updatedContent);
    } catch (error) {
      console.error("Image upload failed:", error);
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      alert("Please provide both title and content.");
      return;
    }
    onSave({ title, content });
  };

  return (
    <div>
      {/* Title Input */}
      <input
        type="text"
        placeholder="Enter Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Content Textarea */}
      <textarea
        id="contentArea"
        rows={10}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your blog content here..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Preview of Content with Inline Images */}
      <div
        className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Image Upload */}
      <div className="my-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
          }}
          className="mb-2"
        />
        {isUploading && <p>Uploading image...</p>}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg shadow-md"
      >
        Save Content
      </button>
    </div>
  );
};
