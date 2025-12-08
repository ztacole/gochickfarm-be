"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffMiddleware = exports.adminMiddleware = exports.authToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const schema_1 = require("../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const authToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Token not found!",
        });
    }
    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET || 'secret';
    try {
        const payload = jsonwebtoken_1.default.verify(token, jwtSecret);
        const [user] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, Number(payload.id)));
        if (!user || user.session_id !== payload.session_id) {
            return res.status(401).json({
                success: false,
                message: "Invalid token or session has expired!",
            });
        }
        req.user = payload;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token or session has expired!",
        });
    }
};
exports.authToken = authToken;
const adminMiddleware = (req, res, next) => {
    if (req.user?.role?.name !== "Admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied! Only admin can access this resource.",
        });
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
const staffMiddleware = (req, res, next) => {
    if (req.user?.role?.name !== "Staff") {
        return res.status(403).json({
            success: false,
            message: "Access denied! Only staff can access this resource.",
        });
    }
    next();
};
exports.staffMiddleware = staffMiddleware;
