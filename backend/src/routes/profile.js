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
exports.profileRouter = void 0;
var hono_1 = require("hono");
var edge_1 = require("@prisma/client/edge");
var extension_accelerate_1 = require("@prisma/extension-accelerate");
var jwt_1 = require("hono/jwt");
exports.profileRouter = new hono_1.Hono();
exports.profileRouter.use("/*", function (c, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, user, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                authHeader = c.req.header("authorization") || "";
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, (0, jwt_1.verify)(authHeader, c.env.PUBLIC_KEY, "RS256")];
            case 2:
                user = _a.sent();
                if (!user) return [3 /*break*/, 4];
                c.set("userId", user.id);
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
// Get profile data for the logged-in user
exports.profileRouter.get("/myprofile", function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var loggedInUserId, prisma, user, profileData, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loggedInUserId = Number(c.get("userId"));
                console.log("Logged-in User ID:", loggedInUserId);
                prisma = new edge_1.PrismaClient({
                    datasourceUrl: c.env.DATABASE_URL,
                }).$extends((0, extension_accelerate_1.withAccelerate)());
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { id: loggedInUserId }, // Use the logged-in user's ID to get their profile
                        select: {
                            name: true,
                            _count: {
                                select: {
                                    followers: true, // Number of followers
                                    following: true, // Number of users they are following
                                },
                            },
                        },
                    })];
            case 2:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, c.json({ error: "User not found" }, 404)]; // Return 404 if the user does not exist
                }
                profileData = {
                    name: user.name,
                    followers: user._count.followers, // Total number of followers
                    following: user._count.following, // Total number of users they are following
                };
                return [2 /*return*/, c.json(profileData)]; // Send the profile data back to the client
            case 3:
                error_1 = _a.sent();
                console.log("Error fetching profile data:", error_1);
                return [2 /*return*/, c.json({ error: "Error fetching profile data" }, 500)];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Get profile data for any user by ID, including whether the logged-in user is following them
exports.profileRouter.get("/:id", function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var profileId, loggedInUserId, prisma, user, profileData, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                profileId = Number(c.req.param("id"));
                loggedInUserId = Number(c.get("userId"));
                prisma = new edge_1.PrismaClient({
                    datasourceUrl: c.env.DATABASE_URL,
                }).$extends((0, extension_accelerate_1.withAccelerate)());
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.user.findUnique({
                        where: { id: profileId },
                        select: {
                            name: true,
                            _count: {
                                select: {
                                    followers: true, // Number of followers
                                    following: true, // Number of users they are following
                                },
                            },
                            // Check if the logged-in user is following this profile by checking the `Follow` table
                            followers: {
                                where: { followerId: loggedInUserId }, // Check if the logged-in user is following the profile
                            },
                        },
                    })];
            case 2:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, c.json({ error: "User not found" }, 404)];
                }
                profileData = {
                    name: user.name,
                    followers: user._count.followers, // Total number of followers
                    following: user._count.following, // Total number of users they are following
                    isFollowing: user.followers.length > 0, // True if the current user is following this profile
                };
                return [2 /*return*/, c.json(profileData)];
            case 3:
                error_2 = _a.sent();
                console.log(error_2);
                return [2 /*return*/, c.json({ error: "Error fetching profile data" }, 500)];
            case 4: return [2 /*return*/];
        }
    });
}); });
