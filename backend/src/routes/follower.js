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
exports.followerRouter = void 0;
var edge_1 = require("@prisma/client/edge");
var extension_accelerate_1 = require("@prisma/extension-accelerate");
var hono_1 = require("hono");
var jwt_1 = require("hono/jwt");
var firebase_1 = require("./firebase");
var axios_1 = require("axios");
exports.followerRouter = new hono_1.Hono();
// Middleware for user authentication and setting userId
exports.followerRouter.use("/*", function (c, next) { return __awaiter(void 0, void 0, void 0, function () {
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
                c.set("userId", user.id);
                c.set("token", authHeader);
                return [4 /*yield*/, next()];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                c.status(403);
                return [2 /*return*/, c.json({ message: "You are not authenticated" })];
            case 5: return [3 /*break*/, 7];
            case 6:
                e_1 = _a.sent();
                c.status(403);
                return [2 /*return*/, c.json({ message: "You are not logged in", authHeader: authHeader })];
            case 7: return [2 /*return*/];
        }
    });
}); });
// Route for fetching users the current user is following
exports.followerRouter.get("/following", function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var id, prisma, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = Number(c.get("userId"));
                prisma = new edge_1.PrismaClient({
                    datasourceUrl: c.env.DATABASE_URL,
                }).$extends((0, extension_accelerate_1.withAccelerate)());
                return [4 /*yield*/, prisma.follow.findMany({
                        where: {
                            followerId: id
                        },
                        select: {
                            followingId: true, // Select the IDs of users being followed
                            followerId: true
                        }
                    })];
            case 1:
                response = _a.sent();
                if (response) {
                    c.status(200);
                    return [2 /*return*/, c.json({ response: response })];
                }
                else {
                    c.status(500);
                    return [2 /*return*/, c.json({ message: "Error fetching follow data" })];
                }
                return [2 /*return*/];
        }
    });
}); });
// Route for following a user
exports.followerRouter.post("/follow/:followingId", function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var followingId, followerId, prisma, follow, followedUser, fcm, jwt, accessToken, payload, response, error_1, message, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                followingId = Number(c.req.param("followingId"));
                followerId = Number(c.get("userId"));
                prisma = new edge_1.PrismaClient({
                    datasourceUrl: c.env.DATABASE_URL,
                }).$extends((0, extension_accelerate_1.withAccelerate)());
                _a.label = 1;
            case 1:
                _a.trys.push([1, 12, , 13]);
                return [4 /*yield*/, prisma.follow.create({
                        data: {
                            followerId: followerId,
                            followingId: followingId,
                        }
                    })];
            case 2:
                follow = _a.sent();
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { id: followingId },
                        select: { name: true }
                    })];
            case 3:
                followedUser = _a.sent();
                return [4 /*yield*/, prisma.user.findUnique({
                        where: {
                            id: followingId,
                        },
                        select: {
                            fcmtoken: true
                        }
                    })];
            case 4:
                fcm = _a.sent();
                jwt = c.get("token");
                console.log(jwt);
                return [4 /*yield*/, (0, firebase_1.getAccessToken)(jwt)];
            case 5:
                accessToken = _a.sent();
                if (!fcm) return [3 /*break*/, 9];
                payload = {
                    message: {
                        token: fcm.fcmtoken,
                        notification: {
                            title: "New Follower",
                            body: "You have a new follower: ".concat(followerId),
                        },
                    },
                };
                _a.label = 6;
            case 6:
                _a.trys.push([6, 8, , 9]);
                return [4 /*yield*/, axios_1.default.post(c.env.URL, payload, {
                        headers: {
                            Authorization: "Bearer ".concat(accessToken),
                        },
                    })];
            case 7:
                response = _a.sent();
                console.log(2);
                return [3 /*break*/, 9];
            case 8:
                error_1 = _a.sent();
                console.error("Error sending FCM message:", error_1);
                return [3 /*break*/, 9];
            case 9:
                if (!followedUser) return [3 /*break*/, 11];
                message = "You have a new follower: ".concat(followerId);
                return [4 /*yield*/, prisma.notification.create({
                        data: {
                            recipientId: followingId,
                            message: message,
                            read: false
                        }
                    })];
            case 10:
                _a.sent();
                _a.label = 11;
            case 11:
                c.status(200);
                return [2 /*return*/, c.json({ message: "Now following this user", follow: follow })];
            case 12:
                error_2 = _a.sent();
                console.error(error_2);
                c.status(500);
                return [2 /*return*/, c.json({ error: "Error following user" })];
            case 13: return [2 /*return*/];
        }
    });
}); });
// Route for unfollowing a user
exports.followerRouter.delete("/unfollow/:followingId", function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var followingId, followerId, prisma, unfollowedUser, fcm, jwt, accessToken, payload, response, error_3, message, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                followingId = Number(c.req.param("followingId"));
                followerId = Number(c.get("userId"));
                prisma = new edge_1.PrismaClient({
                    datasourceUrl: c.env.DATABASE_URL,
                }).$extends((0, extension_accelerate_1.withAccelerate)());
                _a.label = 1;
            case 1:
                _a.trys.push([1, 12, , 13]);
                return [4 /*yield*/, prisma.follow.deleteMany({
                        where: {
                            followerId: followerId,
                            followingId: followingId,
                        }
                    })];
            case 2:
                _a.sent();
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { id: followingId },
                        select: { name: true }
                    })];
            case 3:
                unfollowedUser = _a.sent();
                return [4 /*yield*/, prisma.user.findUnique({
                        where: {
                            id: followingId,
                        },
                        select: {
                            fcmtoken: true
                        }
                    })];
            case 4:
                fcm = _a.sent();
                jwt = c.get("token");
                console.log(jwt);
                return [4 /*yield*/, (0, firebase_1.getAccessToken)(jwt)];
            case 5:
                accessToken = _a.sent();
                if (!fcm) return [3 /*break*/, 9];
                payload = {
                    message: {
                        token: fcm.fcmtoken,
                        notification: {
                            title: "Person Unfollow",
                            body: "You have been unfollowed by: ".concat(followerId),
                        },
                    },
                };
                _a.label = 6;
            case 6:
                _a.trys.push([6, 8, , 9]);
                return [4 /*yield*/, axios_1.default.post(c.env.URL, payload, {
                        headers: {
                            Authorization: "Bearer ".concat(accessToken),
                        },
                    })];
            case 7:
                response = _a.sent();
                console.log(2);
                return [3 /*break*/, 9];
            case 8:
                error_3 = _a.sent();
                console.error("Error sending FCM message:", error_3);
                return [3 /*break*/, 9];
            case 9:
                if (!unfollowedUser) return [3 /*break*/, 11];
                message = "You have been unfollowed by: ".concat(followerId);
                return [4 /*yield*/, prisma.notification.create({
                        data: {
                            recipientId: followingId,
                            message: message,
                            read: false
                        }
                    })];
            case 10:
                _a.sent();
                _a.label = 11;
            case 11:
                c.status(200);
                return [2 /*return*/, c.json({ message: "Unfollowed the user" })];
            case 12:
                error_4 = _a.sent();
                console.error(error_4);
                c.status(500);
                return [2 /*return*/, c.json({ error: "Error unfollowing user" })];
            case 13: return [2 /*return*/];
        }
    });
}); });
