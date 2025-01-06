import React from "react";
import { Blog } from "../hooks";
import { AppbarReport } from "./AppbarReport";
import { Avatar } from "./BlogCard";

export const FullBlog = ({ blog }: { blog: Blog }) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Appbar with Report Button */}
      <AppbarReport blogId={blog.id} />

      {/* Main Blog Content */}
      <div className="flex justify-center pt-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-screen-lg">
          {/* Title Section */}
          <div className="relative">
            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight">
              {blog.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-start mt-4 space-x-4">
              {/* Avatar */}
              <div>
                <Avatar size="big" name={blog.author.name || "Anonymous"} />
              </div>
              {/* Author Name and Date */}
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {blog.author.name || "Anonymous"}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  {new Date(blog.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Banner Image */}
          {blog.bannerImage && (
            <div className="mt-12">
              <img
                src={blog.bannerImage}
                alt="Banner"
                className="rounded-lg shadow-lg mx-auto w-full max-w-[800px] max-h-[450px] object-contain"
              />
            </div>
          )}

          {/* Blog Content */}
          <div className="prose prose-lg max-w-none mt-12">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>

          {/* Topics Section */}
          {blog.topics && blog.topics.length > 0 && (
            <div className="mt-12">
              <h4 className="text-xl font-semibold text-gray-800">Topics</h4>
              <div className="flex flex-wrap gap-3 mt-4">
                {blog.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="inline-block bg-blue-100 text-blue-700 text-sm font-medium py-1 px-3 rounded-full shadow-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
