"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRouter = void 0;
var mediumpackage_1 = require("@govindmishra/mediumpackage");
var edge_1 = require("@prisma/client/edge");
var extension_accelerate_1 = require("@prisma/extension-accelerate");
var hono_1 = require("hono");
var jwt_1 = require("hono/jwt");
var axios_1 = require("axios");
// import { getAccessToken } from "./firebase";
var firebase_1 = require("./firebase");
exports.blogRouter = new hono_1.Hono();
exports.blogRouter.use("/*", function (c, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, user, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                authHeader = c.req.header("authorization");
                if (!authHeader) return [3 /*break*/, 7];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, (0, jwt_1.verify)(authHeader, c.env.PUBLIC_KEY, 'RS256')];
            case 2:
                user = _a.sent();
                if (!user) return [3 /*break*/, 4];
                c.set("userId", user.id);
                c.set("token", authHeader);
                return [4 /*yield*/, next()];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                c.status(403);
                return [2 /*return*/, c.json({ message: "You are not logged in" })];
            case 5: return [3 /*break*/, 7];
            case 6:
                e_1 = _a.sent();
                c.status(403);
                return [2 /*return*/, c.json({ message: "You are not logged in" })];
            case 7: return [2 /*return*/];
        }
    });
}); });
exports.blogRouter.post('/', function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var body, _a, success, data, authorId, prisma, blog, followers, jwt, accessToken, fcmTokens, _i, fcmTokens_1, token, payload, error_1, notifications;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, c.req.json()];
            case 1:
                body = _b.sent();
                _a = mediumpackage_1.createBlogInput.safeParse(body), success = _a.success, data = _a.data;
                if (!success) {
                    c.status(411);
                    return [2 /*return*/, c.json({ message: 'Inputs not correct' })];
                }
                authorId = Number(c.get('userId'));
                prisma = new edge_1.PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends((0, extension_accelerate_1.withAccelerate)());
                return [4 /*yield*/, prisma.blog.create({
                        data: {
                            title: data.title,
                            content: JSON.stringify(data.content), // Save Editor.js content as JSON
                            bannerImage: data.bannerImage,
                            authorId: authorId,
                            topics: { set: data.topics }, // Assuming your schema uses a string[] for topics
                        },
                    })];
            case 2:
                blog = _b.sent();
                return [4 /*yield*/, prisma.follow.findMany({
                        where: { followingId: authorId },
                        select: { follower: { select: { fcmtoken: true } }, followerId: true },
                    })];
            case 3:
                followers = _b.sent();
                jwt = c.get("token");
                return [4 /*yield*/, (0, firebase_1.getAccessToken)(jwt)];
            case 4:
                accessToken = _b.sent();
                fcmTokens = followers
                    .map(function (follower) { return follower.follower.fcmtoken; })
                    .filter(function (token) { return token; });
                if (!(fcmTokens.length > 0)) return [3 /*break*/, 10];
                _i = 0, fcmTokens_1 = fcmTokens;
                _b.label = 5;
            case 5:
                if (!(_i < fcmTokens_1.length)) return [3 /*break*/, 10];
                token = fcmTokens_1[_i];
                payload = {
                    message: {
                        token: token,
                        notification: {
                            title: "New Blog Post",
                            body: "A new blog post titled \"".concat(data.title, "\" has been published!"),
                        },
                    },
                };
                _b.label = 6;
            case 6:
                _b.trys.push([6, 8, , 9]);
                return [4 /*yield*/, axios_1.default.post(c.env.URL, payload, { headers: { Authorization: "Bearer ".concat(accessToken) } })];
            case 7:
                _b.sent();
                return [3 /*break*/, 9];
            case 8:
                error_1 = _b.sent();
                console.error("Error sending FCM message:", error_1);
                return [3 /*break*/, 9];
            case 9:
                _i++;
                return [3 /*break*/, 5];
            case 10:
                notifications = followers.map(function (follower) { return ({
                    message: "New blog post published: ".concat(data.title),
                    recipientId: follower.followerId,
                }); });
                return [4 /*yield*/, prisma.notification.createMany({ data: notifications })];
            case 11:
                _b.sent();
                return [2 /*return*/, c.json({ id: blog.id })];
        }
    });
}); });
// Update blog and notify followers
exports.blogRouter.put('/', function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var body, success, prisma, blog, followers, reporters;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, c.req.json()];
            case 1:
                body = _a.sent();
                success = mediumpackage_1.updateBlogInput.safeParse(body).success;
                if (!success) {
                    c.status(411);
                    return [2 /*return*/, c.json({ message: "Inputs not correct" })];
                }
                prisma = new edge_1.PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends((0, extension_accelerate_1.withAccelerate)());
                return [4 /*yield*/, prisma.blog.update({
                        where: { id: body.id },
                        data: { title: body.title, content: body.content },
                        include: { author: true },
                    })];
            case 2:
                blog = _a.sent();
                return [4 /*yield*/, prisma.follow.findMany({
                        where: { followingId: blog.authorId },
                        select: { followerId: true },
                    })];
            case 3:
                followers = _a.sent();
                return [4 /*yield*/, prisma.report.findMany({
                        where: { blogId: blog.id },
                        select: { userId: true },
                    })];
            case 4:
                reporters = _a.sent();
                // Create a notification for each follower who has not reported the blog
                return [4 /*yield*/, Promise.all(followers.map(function (follower) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!!reporters.find(function (reporter) { return reporter.userId === follower.followerId; })) return [3 /*break*/, 2];
                                    return [4 /*yield*/, prisma.notification.create({
                                            data: {
                                                recipientId: follower.followerId,
                                                message: "Blog \"".concat(blog.title, "\" has been updated by ").concat(blog.author.name),
                                                read: false,
                                            },
                                        })];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 5:
                // Create a notification for each follower who has not reported the blog
                _a.sent();
                return [2 /*return*/, c.json({ id: blog.id })];
        }
    });
}); });
// Fetch all blogs excluding the ones reported by the current user
exports.blogRouter.get('/bulk', function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, prisma, blogs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = Number(c.get("userId"));
                prisma = new edge_1.PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends((0, extension_accelerate_1.withAccelerate)());
                return [4 /*yield*/, prisma.blog.findMany({
                        where: {
                            authorId: { not: userId },
                            reports: { none: { userId: userId } },
                        },
                        select: {
                            id: true,
                            title: true,
                            content: true,
                            authorId: true,
                            createdAt: true,
                            author: { select: { name: true, id: true } },
                        },
                    })];
            case 1:
                blogs = _a.sent();
                return [2 /*return*/, c.json({ blogs: blogs })];
        }
    });
}); });
// Fetch blogs created by the current user
exports.blogRouter.get('/myblog', function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var prisma, blogs, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                prisma = new edge_1.PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends((0, extension_accelerate_1.withAccelerate)());
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.blog.findMany({
                        where: { authorId: Number(c.get("userId")) },
                        select: {
                            id: true,
                            title: true,
                            content: true,
                            authorId: true,
                            createdAt: true,
                            author: { select: { name: true } },
                        },
                    })];
            case 2:
                blogs = _a.sent();
                return [2 /*return*/, c.json({ blogs: blogs })];
            case 3:
                e_2 = _a.sent();
                c.status(411);
                return [2 /*return*/, c.json({ message: "Error while fetching blog post" })];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Fetch blogs by a specific author
exports.blogRouter.get("/profile/:id", function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var id, prisma, blogs, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = Number(c.req.param("id"));
                prisma = new edge_1.PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends((0, extension_accelerate_1.withAccelerate)());
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.blog.findMany({
                        where: { authorId: id },
                        select: {
                            id: true,
                            title: true,
                            content: true,
                            authorId: true,
                            createdAt: true,
                            author: { select: { name: true } },
                        },
                    })];
            case 2:
                blogs = _a.sent();
                return [2 /*return*/, c.json({ blogs: blogs })];
            case 3:
                e_3 = _a.sent();
                c.status(411);
                return [2 /*return*/, c.json({ message: "Error while fetching blog post" })];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Fetch a specific blog by its ID
exports.blogRouter.get('/:id', function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var id, prisma, blog, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = c.req.param("id");
                prisma = new edge_1.PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends((0, extension_accelerate_1.withAccelerate)());
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.blog.findFirst({
                        where: { id: id },
                        select: {
                            id: true,
                            title: true,
                            content: true,
                            authorId: true,
                            createdAt: true,
                            author: { select: { name: true } },
                        },
                    })];
            case 2:
                blog = _a.sent();
                return [2 /*return*/, c.json({ blog: blog })];
            case 3:
                e_4 = _a.sent();
                c.status(411);
                return [2 /*return*/, c.json({ message: "Error while fetching blog post" })];
            case 4: return [2 /*return*/];
        }
    });
}); });
