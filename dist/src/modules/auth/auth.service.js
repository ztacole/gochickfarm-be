"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../../drizzle/schema");
const db_1 = require("../../config/db");
const error_1 = require("../../common/error");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    static async login(email, password, role) {
        const [user] = await db_1.db.select({
            id: schema_1.users.id,
            email: schema_1.users.email,
            password: schema_1.users.password,
            full_name: schema_1.users.full_name,
            role: schema_1.roles
        }).from(schema_1.users).innerJoin(schema_1.roles, (0, drizzle_orm_1.eq)(schema_1.users.role_id, schema_1.roles.id)).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        if (!user)
            throw new error_1.UnauthorizedError('Invalid credentials!');
        if (!await bcryptjs_1.default.compare(password, user.password))
            throw new error_1.UnauthorizedError('Invalid credentials!');
        if (role && user.role.name !== role)
            throw new error_1.UnauthorizedError('You are not authorized!');
        const token = await this.generateToken(user);
        return {
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role
            },
            token,
            expired_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        };
    }
    static async me(userId) {
        const [user] = await db_1.db.select({
            id: schema_1.users.id,
            email: schema_1.users.email,
            full_name: schema_1.users.full_name,
            role: schema_1.roles
        }).from(schema_1.users).innerJoin(schema_1.roles, (0, drizzle_orm_1.eq)(schema_1.users.role_id, schema_1.roles.id)).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
        if (!user)
            throw new error_1.UnauthorizedError('Invalid token!');
        return user;
    }
    static async generateToken(user) {
        const jwtSecret = process.env.JWT_SECRET || 'secret';
        const sessionId = crypto.randomUUID();
        await db_1.db.update(schema_1.users).set({ session_id: sessionId }).where((0, drizzle_orm_1.eq)(schema_1.users.id, user.id));
        user.session_id = sessionId;
        return jsonwebtoken_1.default.sign(user, jwtSecret, { expiresIn: '7d' });
    }
}
exports.AuthService = AuthService;
