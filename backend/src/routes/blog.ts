import { createBlogInput, updateBlogInput } from "@govindmishra/mediumpackage";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import axios from "axios"
// import { getAccessToken } from "./firebase";
import { getAccessToken } from "./firebase";







 
export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        PUBLIC_KEY: string;
        PRIVATE_KEY: string;
        URL:string;
    }, 
    Variables: {
        userId: string;
        token:string
    }
}>();

blogRouter.use("/*", async (c, next) => {

    const authHeader = c.req.header("authorization") ;
    console.log(authHeader);
    if(authHeader){
            try {

              const user = await verify(authHeader, c.env.PUBLIC_KEY, 'RS256'); 
            // console.log(user);
              if (user) {
                c.set("userId", user.id as string);
                c.set("token",authHeader);
                await next();
              
               
                
              } else {
                  c.status(403);
                  return c.json({ message: "You are not logged in" });
              }
          } catch(e) {
              c.status(403);
              return c.json({ message: "You are not logged in" });
          }

    }
   // console.log(authHeader)
  
});




blogRouter.post('/', async (c) => {
  const body = await c.req.json();
  const { success, data } = createBlogInput.safeParse(body); // Ensure validation
  if (!success) {
    c.status(411);
    return c.json({ message: 'Inputs not correct' });
  }

  const authorId = Number(c.get('userId'));
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  // Step 1: Create the blog
  console.log(data);
  const blog = await prisma.blog.create({
    data: {
      title: data.title,
      content: JSON.stringify(data.content), // Save Editor.js content as JSON
      bannerImage: data.bannerImage,
      authorId,
      topics: { set: data.topics }, // Assuming your schema uses a string[] for topics
    },
  });

  // Step 2: Save FCM token of the author (optional, if not already saved)

  // Step 3: Fetch followers with FCM tokens
  const followers = await prisma.follow.findMany({
    where: { followingId: authorId },
    select: { follower: { select: { fcmtoken: true } }, followerId: true },
  });

  const jwt = c.get("token");
  const accessToken = await getAccessToken(jwt);
  const fcmTokens = followers
    .map((follower:any) => follower.follower.fcmtoken)
    .filter((token:any) => token);

  // Step 5: Send notifications
  if (fcmTokens.length > 0) {
    for (const token of fcmTokens) {
      const payload = {
        message: {
          token,
          notification: {
            title: "New Blog Post",
            body: `A new blog post titled "${data.title}" has been published!`,
          },
        },
      };

      try {
        await axios.post(
          c.env.URL,
          payload,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      } catch (error) {
        console.error("Error sending FCM message:", error);
      }
    }
  }

  // Step 6: Store notifications in the database
  const notifications = followers.map((follower:any) => ({
    message: `New blog post published: ${data.title}`,
    recipientId: follower.followerId,
  }));

  await prisma.notification.createMany({ data: notifications });

  return c.json({ id: blog.id });
});


// Update blog and notify followers
blogRouter.put('/', async (c) => {
  const body = await c.req.json();
  const { success } = updateBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ message: "Inputs not correct" });
  }

  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  const blog = await prisma.blog.update({
    where: { id: body.id },
    data: { title: body.title, content: body.content },
    include: { author: true },
  });

  // Get the followers of the blog author
  const followers = await prisma.follow.findMany({
    where: { followingId: blog.authorId },
    select: { followerId: true },
  });

  // Get the users who have reported the blog
  const reporters = await prisma.report.findMany({
    where: { blogId: blog.id },
    select: { userId: true },
  });

  // Create a notification for each follower who has not reported the blog
  await Promise.all(followers.map(async (follower:any) => {
    if (!reporters.find((reporter:any) => reporter.userId === follower.followerId)) {
      await prisma.notification.create({
        data: {
          recipientId: follower.followerId,
          message: `Blog "${blog.title}" has been updated by ${blog.author.name}`,
          read: false,
        },
      });
    }
  }));

  return c.json({ id: blog.id });
});

// Fetch all blogs excluding the ones reported by the current user
blogRouter.get('/bulk', async (c) => {
  const userId = Number(c.get("userId"));
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  const blogs = await prisma.blog.findMany({
    where: {
      authorId: { not: userId },
      reports: { none: { userId } },
    },
    select: {
      id: true,
      title: true,
      content: true,
      authorId: true,
      createdAt:true,
      author: { select: { name: true, id: true } },
    },
  });
 

  return c.json({ blogs });
});

// Fetch blogs created by the current user
blogRouter.get('/myblog', async (c) => {
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    const blogs = await prisma.blog.findMany({
      where: { authorId: Number(c.get("userId")) },
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true,
        createdAt:true,
        author: { select: { name: true } },
      },
    });

    return c.json({ blogs });
  } catch (e) {
    c.status(411);
    return c.json({ message: "Error while fetching blog post" });
  }
});

// Fetch blogs by a specific author
blogRouter.get("/profile/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    const blogs = await prisma.blog.findMany({
      where: { authorId: id },
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true,
        createdAt:true,
        author: { select: { name: true } },
      },
    });

    return c.json({ blogs });
  } catch (e) {
    c.status(411);
    return c.json({ message: "Error while fetching blog post" });
  }
});

// Fetch a specific blog by its ID
blogRouter.get('/:id', async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  try {
    const blog = await prisma.blog.findFirst({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true,
        createdAt:true,
        bannerImage:true,
        topics:true,
        author: { select: { name: true } },
      },
    });

    return c.json({ blog });
  } catch (e) {
    c.status(411);
    return c.json({ message: "Error while fetching blog post" });
  }
});
