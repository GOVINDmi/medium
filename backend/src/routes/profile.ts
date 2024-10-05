import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { verify } from "hono/jwt";

export const  profileRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  },
  Variables: {
    userId: string;
  }
}>();

 profileRouter.use("/*", async (c, next) => {
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



profileRouter.get("/myprofile", async (c) => {
   
    const loggedInUserId = Number(c.get("userId")); // ID of the currently logged-in user
     console.log("Logged-in User ID:", loggedInUserId);

        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())

        try {
           // Fetch the profile data for the logged-in user
            const user = await prisma.user.findUnique({
                where: { id: loggedInUserId }, // Use the logged-in user's ID to get their profile
                select: {
                    name: true,
                    _count: {
                        select: {
                            followers: true,   // Number of followers
                            following: true,   // Number of users they are following
                        },
                    },
                },
            });

    if (!user) {
        return c.json({ error: "User not found" }, 404); // Return 404 if the user does not exist
    }

   // Structure the response data
    const profileData = {
        name: user.name,
        followers: user._count.followers, // Total number of followers
        following: user._count.following, // Total number of users they are following
    };

    return c.json(profileData); // Send the profile data back to the client
} catch (error) {
    console.log("Error fetching profile data:", error);
    return c.json({ error: "Error fetching profile data" }, 500);
}

});

// Get notifications for the current user
 profileRouter.get("/:id", async (c) => {
    const profileId = Number(c.req.param("id")); // ID of the user whose profile is being viewed
    const loggedInUserId = Number(c.get("userId")); // ID of the currently logged-in user

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())

    try {
        // Fetch user profile data
        const user = await prisma.user.findUnique({
            where: { id: profileId },
            select: {
                name: true,
                _count: {
                    select: {
                        followers: true,   // Number of followers
                        following: true,   // Number of users they are following
                    },
                },
                followers: {
                    where: { followerId: loggedInUserId },  // Check if the current logged-in user is following
                },
            },
        });

        if (!user) {
            return c.json({ error: "User not found" }, 404);
        }

        // Structure the response data
        const profileData = {
            name: user.name,
            followers: user._count.followers, // Total number of followers
            following: user._count.following, // Total number of users they are following
            isFollowing: user.followers.length > 0, // True if the current user is following this profile
        };

        return c.json(profileData);
    } catch (error) {
        console.log(error);
        return c.json({ error: "Error fetching profile data" }, 500);
    }
});


 