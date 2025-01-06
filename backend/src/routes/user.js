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
exports.userRouter = void 0;
var hono_1 = require("hono");
var edge_1 = require("@prisma/client/edge");
var extension_accelerate_1 = require("@prisma/extension-accelerate");
var jwt_1 = require("hono/jwt");
//import axios from "axios"
//import * as serviceAccount from '../medium-413fd-firebase-adminsdk-akkw3-a95c0dbb9e.json';
var mediumpackage_1 = require("@govindmishra/mediumpackage");
exports.userRouter = new hono_1.Hono();
exports.userRouter.post('/signup', function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var body, success, prisma, user, author, token, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, c.req.json()];
            case 1:
                body = _a.sent();
                success = mediumpackage_1.signupInput.safeParse(body).success;
                if (!success) {
                    c.status(400); // Changed to 400 for bad request
                    return [2 /*return*/, c.json({
                            message: "Inputs not correct"
                        })];
                }
                console.log(c.env.DATABASE_URL);
                prisma = new edge_1.PrismaClient({
                    datasourceUrl: c.env.DATABASE_URL,
                }).$extends((0, extension_accelerate_1.withAccelerate)());
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, prisma.user.create({
                        data: {
                            username: body.username,
                            password: body.password, // Consider hashing the password
                            name: body.name,
                            fcmtoken: body.token,
                        }
                    })];
            case 3:
                user = _a.sent();
                author = user.name || "Anonymous User";
                token = (0, jwt_1.sign)({ id: user.id }, c.env.PRIVATE_KEY, 'RS256');
                return [2 /*return*/, c.json({ token: token, author: author })];
            case 4:
                e_1 = _a.sent();
                console.error(e_1);
                c.status(500);
                return [2 /*return*/, c.text('Server error')];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.userRouter.post('/signin', function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var body, success, prisma, user, iat, exp, paylo, token, _a, header, payload, e_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, c.req.json()];
            case 1:
                body = _b.sent();
                success = mediumpackage_1.signinInput.safeParse(body).success;
                if (!success) {
                    c.status(400); // Changed to 400 for bad request
                    return [2 /*return*/, c.json({
                            message: "Inputs not correct"
                        })];
                }
                prisma = new edge_1.PrismaClient({
                    datasourceUrl: c.env.DATABASE_URL,
                }).$extends((0, extension_accelerate_1.withAccelerate)());
                _b.label = 2;
            case 2:
                _b.trys.push([2, 5, , 6]);
                return [4 /*yield*/, prisma.user.findFirst({
                        where: {
                            username: body.username,
                            password: body.password, // Consider verifying against hashed password
                        }
                    })];
            case 3:
                user = _b.sent();
                if (!user) {
                    c.status(403);
                    return [2 /*return*/, c.json({
                            message: "Incorrect credentials"
                        })];
                }
                iat = Math.floor(Date.now() / 1000);
                exp = iat + 3600;
                paylo = {
                    "iss": c.env.ISS,
                    "scope": "https://www.googleapis.com/auth/firebase.messaging",
                    "aud": "https://oauth2.googleapis.com/token",
                    "id": user.id
                };
                // Replace line breaks in the private key
                //const privatek = serviceAccount.private_key.replace(/\\n/g, '\n');
                console.log(c.env.PRIVATE_KEY);
                return [4 /*yield*/, (0, jwt_1.sign)(paylo, c.env.PRIVATE_KEY, "RS256")];
            case 4:
                token = _b.sent();
                _a = (0, jwt_1.decode)(token), header = _a.header, payload = _a.payload;
                //console.log(header);
                return [2 /*return*/, c.json({
                        token: token,
                        author: user.name
                    })];
            case 5:
                e_2 = _b.sent();
                console.error(e_2);
                c.status(500);
                return [2 /*return*/, c.text('Server error')];
            case 6: return [2 /*return*/];
        }
    });
}); });
