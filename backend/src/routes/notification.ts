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
      where: { recipientId: userId },
      orderBy: { createdAt: "desc" },
      select: {
        recipientId: true,  // Adjusted to match composite key
        createdAt: true,    // Adjusted to match composite key
        message: true,
        read: true
      }
    });

    return c.json({ notifications });
  } catch (e) {
    c.status(500);
    return c.json({ message: "Error fetching notifications" });
  }
});

// Mark all notifications as read for the current user
notificationRouter.patch("/all", async (c) => {
  const userId = Number(c.get("userId"));

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const updatedNotifications = await prisma.notification.updateMany({
      where: {
        recipientId: userId
      },
      data: {
        read: true
      }
    });
    
    c.status(200);
    return c.json({ message: "All notifications marked as read" });
  } catch (e) {
    c.status(500);
    return c.json({ message: "Error marking all notifications as read", userId });
  }
});

// Mark a single notification as read based on recipientId and createdAt
notificationRouter.patch("/:createdAt", async (c) => {
  const userId = Number(c.get("userId"));
  const createdAt = c.req.param("createdAt");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const updatedNotification = await prisma.notification.update({
      where: {
        recipientId_createdAt: {
          recipientId: userId,
          createdAt: new Date(createdAt) // Ensure it's converted to Date
        }
      },
      data: {
        read: true
      }
    });

    c.status(200);
    return c.json({ message: "Notification marked as read" });
  } catch (e) {
    c.status(500);
    return c.json({ message: "Error marking notification as read", createdAt });
  }
});
