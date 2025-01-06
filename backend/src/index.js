"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hono_1 = require("hono");
var user_1 = require("./routes/user");
var blog_1 = require("./routes/blog");
var follower_1 = require("./routes/follower");
var notification_1 = require("./routes/notification"); // Import notification router
var cors_1 = require("hono/cors");
var profile_1 = require("./routes/profile");
var report_1 = require("./routes/report");
//import {fire} from "./routes/firebase"
var app = new hono_1.Hono();
app.use("/*", (0, cors_1.cors)());
app.route("/api/v1/user", user_1.userRouter);
app.route("/api/v1/blog", blog_1.blogRouter);
app.route("/api/v1/followers", follower_1.followerRouter);
app.route("/api/v1/report", report_1.reportRouter);
app.route("/api/v1/notifications", notification_1.notificationRouter); // Add notification route
app.route("/api/v1/profile", profile_1.profileRouter);
//app.route("/api/v1",fire);
exports.default = app;
