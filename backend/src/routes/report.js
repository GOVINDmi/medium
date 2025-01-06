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
exports.reportRouter = void 0;
var hono_1 = require("hono");
var edge_1 = require("@prisma/client/edge");
var extension_accelerate_1 = require("@prisma/extension-accelerate");
var jwt_1 = require("hono/jwt");
exports.reportRouter = new hono_1.Hono();
// Middleware to verify JWT and extract user ID
exports.reportRouter.use("/*", function (c, next) { return __awaiter(void 0, void 0, void 0, function () {
    var head, authHeader, user, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                head = c.req.header("authorization") || "";
                authHeader = head.split(' ')[1];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, (0, jwt_1.verify)(authHeader, c.env.PUBLIC_KEY, "RS256")];
            case 2:
                user = _a.sent();
                if (!user) return [3 /*break*/, 4];
                c.set("userId", user.id); // Set userId in the context
                return [4 /*yield*/, next()];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                c.status(403);
                return [2 /*return*/, c.json({ message: "You are not logged in", head: authHeader })];
            case 5: return [3 /*break*/, 7];
            case 6:
                e_1 = _a.sent();
                c.status(500);
                return [2 /*return*/, c.json({ message: "You are not logged in", head: authHeader })];
            case 7: return [2 /*return*/];
        }
    });
}); });
// Route to report a blog
exports.reportRouter.post("/:blogId", function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var loggedInUserId, blogId, prisma, blog, existingReport, updatedBlog, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loggedInUserId = Number(c.get("userId"));
                blogId = c.req.param("blogId");
                prisma = new edge_1.PrismaClient({
                    datasourceUrl: c.env.DATABASE_URL,
                }).$extends((0, extension_accelerate_1.withAccelerate)());
                _a.label = 1;
            case 1:
                _a.trys.push([1, 11, , 12]);
                return [4 /*yield*/, prisma.blog.findUnique({
                        where: { id: blogId },
                        include: { reports: true, author: true },
                    })];
            case 2:
                blog = _a.sent();
                if (!blog) {
                    return [2 /*return*/, c.json({ error: "Blog not found" }, 404)];
                }
                return [4 /*yield*/, prisma.report.findFirst({
                        where: { blogId: blogId, userId: loggedInUserId }
                    })];
            case 3:
                existingReport = _a.sent();
                if (existingReport) {
                    return [2 /*return*/, c.json({ message: "You have already reported this blog" })];
                }
                // Create a report entry
                return [4 /*yield*/, prisma.report.create({
                        data: {
                            blogId: blogId,
                            userId: loggedInUserId,
                        },
                    })];
            case 4:
                // Create a report entry
                _a.sent();
                return [4 /*yield*/, prisma.blog.update({
                        where: { id: blogId },
                        data: { reportCount: { increment: 1 } },
                    })];
            case 5:
                updatedBlog = _a.sent();
                // Create a notification for the blog author
                return [4 /*yield*/, prisma.notification.create({
                        data: {
                            recipientId: blog.authorId,
                            message: "Your blog titled \"".concat(blog.title, "\" has been reported by another user."),
                            read: false,
                        },
                    })];
            case 6:
                // Create a notification for the blog author
                _a.sent();
                if (!(updatedBlog.reportCount >= 2)) return [3 /*break*/, 10];
                // Delete the reports associated with the blog
                return [4 /*yield*/, prisma.report.deleteMany({
                        where: { blogId: blogId },
                    })];
            case 7:
                // Delete the reports associated with the blog
                _a.sent();
                // Delete the blog
                return [4 /*yield*/, prisma.blog.delete({ where: { id: blogId } })];
            case 8:
                // Delete the blog
                _a.sent();
                // Notify the blog author about the deletion
                return [4 /*yield*/, prisma.notification.create({
                        data: {
                            recipientId: updatedBlog.authorId,
                            message: "Your blog titled \"".concat(updatedBlog.title, "\" has been permanently deleted due to multiple reports."),
                            read: false,
                        },
                    })];
            case 9:
                // Notify the blog author about the deletion
                _a.sent();
                return [2 /*return*/, c.json({ message: "Blog has been permanently deleted due to multiple reports." })];
            case 10: return [2 /*return*/, c.json({ message: "Blog reported successfully, and the author has been notified." })];
            case 11:
                error_1 = _a.sent();
                console.error(error_1);
                return [2 /*return*/, c.json({ error: "Failed to report blog" }, 500)];
            case 12: return [2 /*return*/];
        }
    });
}); });
