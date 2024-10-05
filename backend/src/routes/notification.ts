import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";

export const notificationRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  },
  Variables: {
    userId: string;
  }
}>();

notificationRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("authorization") || "";
//   const authHeader = head.split(' ')[1];
  try {
    const user = await verify(authHeader, c.env.JWT_SECRET);
    if (user) {
      c.set("userId", user.id as string);
     
      await next();
    } else {
      c.status(403);
      return c.json({ message: "You are not logged in" });
    }
  } catch (e) {
    c.status(403);
    return c.json({ message: "You are not logged in" });
  }
});

// Get notifications for the current user
notificationRouter.get("/", async (c) => {
  const userId = Number(c.get("userId"));

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const notifications = await prisma.notification.findMany({
      where: { recipientId:userId },
      orderBy: { createdAt: "desc" },
      select:{
        id:true,
        message:true,
        read:true
      }
    });

    return c.json({ notifications });
  } catch (e) {
    c.status(500);
    return c.json({ message: "Error fetching notifications" });
  }
});


notificationRouter.patch('/all', async (c) => {
    const userId = Number(c.get("userId"));
   
    // const notificationId = c.req.param("authorId");
    // console.log(notificationId);
    const body  = await c.req.json();
    console.log(body.read);
  
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    try {
        const updatedNotification = await prisma.notification.updateMany({
            where: {
              recipientId: Number(userId),
            },
            data: {
              read:true 
            },
    
      });
      console.log(updatedNotification);
      c.status(200);
      return c.json({messae:"done"});
    } catch (e) {
      c.status(500);
      return c.json({ message: "Error fetching notifications" ,userId:userId});
    }
  });

notificationRouter.patch('/:notificationId', async (c) => {
    const userId = Number(c.get("userId"));
   
    const notificationId = c.req.param("notificationId");
    console.log(notificationId);
    const body  = await c.req.json();
    console.log(body.read);
  
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    try {
        const updatedNotification = await prisma.notification.update({
            where: {
              id: Number(notificationId),
            },
            data: {
              read:true 
            },
    
      });
      console.log(updatedNotification);
      c.status(200);
      return c.json({messae:"done"});
    } catch (e) {
      c.status(500);
      return c.json({ message: "Error fetching notifications" ,notificationId});
    }
  });


  notificationRouter.patch('/all', async (c) => {
    const userId = Number(c.get("userId"));
   
    // const notificationId = c.req.param("authorId");
    // console.log(notificationId);
    const body  = await c.req.json();
    console.log(body.read);
  
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    try {
        const updatedNotification = await prisma.notification.updateMany({
            where: {
              recipientId: Number(userId),
            },
            data: {
              read:true 
            },
    
      });
      console.log(updatedNotification);
      c.status(200);
      return c.json({messae:"done"});
    } catch (e) {
      c.status(500);
      return c.json({ message: "Error fetching notifications" ,userId:userId});
    }
  });