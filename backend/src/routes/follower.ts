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
            return c.json({
                message: "You are not present in"
            });
        }
    } catch(e) {
        c.status(403);
        return c.json({
            message: "You are not logged in",
            authHeader
        });
    }
});


followerRouter.get("/following", async (c) => {
    const id = Number(c.get("userId"));

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const response = await prisma.follow.findMany({
        where:{
            followerId:id
        },
        select:{
            id:true,
            followerId:true,
            followingId:true
        }
    })
    if(response)
    {
        c.status(200);
        return c.json({
            response
        })
    }
    else
    {
        c.status(500);
        return c.json({
            message:"error "
        })
    }
   
});


followerRouter.post("/follow/:followingId", async (c) => {
    const followingId = c.req.param("followingId");
    const followerId = Number(c.get("userId"));  // Assuming the user is authenticated

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        // Create follow entry in the database
        const follow = await prisma.follow.create({
            data: {
                followerId,
                followingId: Number(followingId),
            },
        });

        // Create a notification for the user being followed
        const followedUser = await prisma.user.findUnique({
            where: { id: Number(followingId) },
            select: { name: true },
        });

        if (followedUser) {
            const message = `You have a new follower: ${followerId}`;
         
            try {
                await prisma.notification.create({
                    data: {
                        recipientId:Number(followingId),
                        message,
                        read: false, // default to unread
                    },
                });
            } catch (error) {
                console.log("Error creating notification:", error);
            }
        }

        c.status(200);
        return c.json({ message: "Now following this user", follow });
    } catch (error) {
        console.log(error);
        c.status(500);
        return c.json({ error: "Error following user" });
    }
});




// Unfollow route
followerRouter.delete("/unfollow/:followingId", async (c) => {
    const followingId = c.req.param("followingId");
    const followerId = Number(c.get("userId"));  // Assuming the user is authenticated

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        // Delete follow entry from the database
        await prisma.follow.deleteMany({
            where: {
                followerId: followerId,
                followingId: Number(followingId),
            },
        });

        // Optionally: Create a notification for the user being unfollowed
        const unfollowedUser = await prisma.user.findUnique({
            where: { id: Number(followingId) },
            select: { name: true },
        });

        if (unfollowedUser) {
            const message = `You have been unfollowed by: ${followerId}`;
            try {
                await prisma.notification.create({
                    data: {
                        recipientId:Number(followingId),
                        message,
                        read: false, // default to unread
                    },
                });
            } catch (error) {
                console.log("Error creating notification:", error);
            }
        }

        c.status(200);
        return c.json({ message: "Unfollowed the user" });
    } catch (error) {
        console.log(error);
        c.status(500);
        return c.json({ error: "Error unfollowing user" });
    }
});
