import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context, Hono } from "hono";
import { verify } from "hono/jwt";

export const followerRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    }, 
    Variables: {
        userId: string;
    }
}>();

// Middleware for user authentication and setting userId
followerRouter.use("/*", async (c, next) => {
    const head = c.req.header("authorization") || ""; 
    const authHeader = head.split(' ')[1];

    try {
        const user = await verify(authHeader, c.env.JWT_SECRET);
        if (user) {
            c.set("userId", user.id as string);
            await next();
        } else {
            c.status(403);
            return c.json({ message: "You are not authenticated" });
        }
    } catch(e) {
        c.status(403);
        return c.json({ message: "You are not logged in", authHeader });
    }
});

// Route for fetching users the current user is following
followerRouter.get("/following", async (c) => {
    const id = Number(c.get("userId"));

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const response = await prisma.follow.findMany({
        where: {
            followerId: id
        },
        select: {
            followingId: true,  // Select the IDs of users being followed
            followerId: true
        }
    });

    if (response) {
        c.status(200);
        return c.json({ response });
    } else {
        c.status(500);
        return c.json({ message: "Error fetching follow data" });
    }
});

// Route for following a user
followerRouter.post("/follow/:followingId", async (c) => {
    const followingId = Number(c.req.param("followingId"));
    const followerId = Number(c.get("userId"));

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const follow = await prisma.follow.create({
            data: {
                followerId,
                followingId,
            }
        });

        // Notify the followed user
        const followedUser = await prisma.user.findUnique({
            where: { id: followingId },
            select: { name: true }
        });

        if (followedUser) {
            const message = `You have a new follower: ${followerId}`;
            await prisma.notification.create({
                data: {
                    recipientId: followingId,
                    message,
                    read: false
                }
            });
        }

        c.status(200);
        return c.json({ message: "Now following this user", follow });
    } catch (error) {
        console.error(error);
        c.status(500);
        return c.json({ error: "Error following user" });
    }
});

// Route for unfollowing a user
followerRouter.delete("/unfollow/:followingId", async (c) => {
    const followingId = Number(c.req.param("followingId"));
    const followerId = Number(c.get("userId"));

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        await prisma.follow.deleteMany({
            where: {
                followerId,
                followingId,
            }
        });

        const unfollowedUser = await prisma.user.findUnique({
            where: { id: followingId },
            select: { name: true }
        });

        if (unfollowedUser) {
            const message = `You have been unfollowed by: ${followerId}`;
            await prisma.notification.create({
                data: {
                    recipientId: followingId,
                    message,
                    read: false
                }
            });
        }

        c.status(200);
        return c.json({ message: "Unfollowed the user" });
    } catch (error) {
        console.error(error);
        c.status(500);
        return c.json({ error: "Error unfollowing user" });
    }
});
