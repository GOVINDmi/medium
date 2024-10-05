import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";

export const reportRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  },
  Variables: {
    userId: string;
  }
}>();

reportRouter.use("/*", async (c, next) => {
    const head = c.req.header("authorization") || ""; 
    const authHeader = head.split(' ')[1];
  try {
    const user = await verify(authHeader, c.env.JWT_SECRET);
    if (user) {
      c.set("userId", user.id as string);
     
      await next();
    } else {
      c.status(403);
      return c.json({ message: "You are not logged in",head:authHeader});
    }
  } catch (e) {
    c.status(500);
    return c.json({ message: "You are not logged in",head:authHeader });
  }
});


reportRouter.post("/:blogId", async (c) => {
    const loggedInUserId = Number(c.get("userId")); // ID of the user reporting the blog
    const blogId = Number(c.req.param("blogId")); // ID of the blog being reported

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        // Check if the blog exists, including the author relationship
        const blog = await prisma.blog.findUnique({
            where: { id: blogId },
            include: { reports: true, author: true },
        });

        if (!blog) {
            return c.json({ error: "Blog not found" }, 404);
        }

        // Check if the logged-in user has already reported this blog
        // const existingReport = await prisma.report.findFirst({
        //     where: { blogId, userId: loggedInUserId }
        // });

        // if (existingReport) {
        //     return c.json({ message: "You have already reported this blog" });
        // }

        // Create a report entry
        await prisma.report.create({
            data: {
                blogId: blogId,
                userId: loggedInUserId,
            },
        });

        // Update the blog's report count
        const updatedBlog = await prisma.blog.update({
            where: { id: blogId },
            data: { reportCount: { increment: 1 } },
        });

        // Create a notification for the blog author
        await prisma.notification.create({
            data: {
                recipientId: blog.authorId, 
                message: `Your blog titled "${blog.title}" has been reported by another user.`,
                read: false, 
            },
        });
         console.log(updatedBlog.reportCount);
        // If reportCount reaches 2, delete the blog
        if (updatedBlog.reportCount >= 2) {
            // Delete the reports associated with the blog
            await prisma.report.deleteMany({
              where: { blogId: blogId },
            });
          
            // Delete the blog
            await prisma.blog.delete({ where: { id: blogId } });
          
            // Create a notification for the blog author
            await prisma.notification.create({
              data: {
                recipientId: updatedBlog.authorId,
                message: `Your blog titled "${updatedBlog.title}" has been permanently deleted due to multiple reports.`,
                read: false,
              },
            });
          
            return c.json({ message: "Blog has been permanently deleted due to multiple reports." });
          }

        return c.json({ message: "Blog reported successfully, and the author has been notified." });
    } catch (error) {
        console.error(error);
        return c.json({ error: "Failed to report blog" }, 500);
    }
});
