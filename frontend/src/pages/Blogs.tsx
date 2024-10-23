import { useEffect } from "react";
import { getMessaging, onMessage } from "firebase/messaging";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";
import { AppbarNotification } from "../components/AppbarNotification";

export const Blogs = () => {
  const { loading, blogs } = useBlogs();

  useEffect(() => {
    const messaging = getMessaging();

    // Listen for incoming notifications
    onMessage(messaging, (payload) => {
      console.log(1);
      console.log('Message received. ', payload);

      
      alert(`New Notification: ${payload.notification?.title} - ${payload.notification?.body}`);

     
    });
  }, []);

  if (loading) {
    return (
      <div>
        <div className="flex justify-center">
          <div>
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AppbarNotification />
      <div className="flex justify-center">
        <div>
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              authorName={blog.author.name}
              title={blog.title}
              content={blog.content}
              authorId={blog.authorId}
              publishedDate={new Date(blog.createdAt).toLocaleString("en-US", {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
