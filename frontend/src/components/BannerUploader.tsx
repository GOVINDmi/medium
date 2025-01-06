import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

interface BannerUploaderProps {
  onUpload: (url: string) => void;
}

export const BannerUploader: React.FC<BannerUploaderProps> = ({ onUpload }) => {
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setBannerImage(file);
      setPreviewUrl(URL.createObjectURL(file)); // Generate preview URL
    }
  };

  const handleRemoveImage = () => {
    setBannerImage(null);
    setPreviewUrl(null);
  };

  const handleUpload = async () => {
    if (!bannerImage) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `banners/${Date.now()}_${bannerImage.name}`);
      await uploadBytes(storageRef, bannerImage);
      const url = await getDownloadURL(storageRef);
      onUpload(url);
      handleRemoveImage(); // Reset after successful upload
    } catch (error) {
      console.error("Banner upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-sm bg-white max-w-md mx-auto mb-5 ml-0">
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Upload Banner Image:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
        />
      </div>

      {previewUrl && (
        <div className="relative mb-4">
          <img
            src={previewUrl}
            alt="Selected Banner"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none"
          >
            ✕
          </button>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!bannerImage || uploading}
        className={`w-full px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none ${
          uploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
        }`}
      >
        {uploading ? "Uploading..." : "Upload Banner"}
      </button>
    </div>
  );
};
