import { Hono } from "hono";
import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blog";
import { followerRouter } from "./routes/follower";
import { notificationRouter } from "./routes/notification"; // Import notification router
import { cors } from "hono/cors";
import { profileRouter } from "./routes/profile";
import { reportRouter } from "./routes/report";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.use("/*", cors());
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);
app.route("/api/v1/followers", followerRouter);
app.route("/api/v1/report" , reportRouter);
app.route("/api/v1/notifications", notificationRouter); // Add notification route
app.route("/api/v1/profile" , profileRouter);


export default app;
