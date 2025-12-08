"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const db_1 = require("../../config/db");
const schema_1 = require("../../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const error_1 = require("../../common/error");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserService {
    static async getAllUsers(page = 1, limit = 10, search = '', role = '') {
        const conditions = [];
        if (search) {
            conditions.push((0, drizzle_orm_1.like)(schema_1.users.full_name, `%${search}%`));
        }
        if (role) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.roles.name, role));
        }
        const usersQuery = db_1.db.select({
            id: schema_1.users.id,
            full_name: schema_1.users.full_name,
            email: schema_1.users.email,
            role: schema_1.roles
        }).from(schema_1.users)
            .innerJoin(schema_1.roles, (0, drizzle_orm_1.eq)(schema_1.users.role_id, schema_1.roles.id))
            .where((0, drizzle_orm_1.and)(...conditions))
            .limit(limit)
            .offset((page - 1) * limit);
        const [totalItemsResult] = await db_1.db.select({
            count: (0, drizzle_orm_1.count)(schema_1.users.id)
        }).from(schema_1.users);
        const totalItems = Number(totalItemsResult.count);
        const totalPages = Math.ceil(totalItems / limit);
        const usersData = await usersQuery.execute();
        return {
            data: usersData.map(user => ({
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            })),
            meta: {
                current_page: page,
                per_page: limit,
                total_pages: totalPages,
                total_items: totalItems
            }
        };
    }
    static async getUserById(id) {
        const [user] = await db_1.db.select({
            id: schema_1.users.id,
            full_name: schema_1.users.full_name,
            email: schema_1.users.email,
            role: schema_1.roles
        }).from(schema_1.users)
            .innerJoin(schema_1.roles, (0, drizzle_orm_1.eq)(schema_1.users.role_id, schema_1.roles.id))
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        if (!user)
            throw new error_1.NotFoundError('User');
        return user;
    }
    static async createUser(data) {
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        const [staffRole] = await db_1.db.select().from(schema_1.roles).where((0, drizzle_orm_1.eq)(schema_1.roles.name, 'Staff'));
        try {
            const [newUserId] = await db_1.db.insert(schema_1.users).values({
                full_name: data.full_name,
                email: data.email,
                password: hashedPassword,
                role_id: staffRole.id
            }).$returningId();
            return {
                id: Number(newUserId.id)
            };
        }
        catch (error) {
            (0, error_1.handleDbError)(error, 'create user data');
        }
    }
    static async updateUser(id, data) {
        const [user] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        if (!user)
            throw new error_1.NotFoundError('User');
        try {
            await db_1.db.update(schema_1.users).set({
                full_name: data.full_name ?? user.full_name,
                email: data.email ?? user.email,
                password: data.password ? await bcryptjs_1.default.hash(data.password, 10) : user.password
            }).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        }
        catch (error) {
            (0, error_1.handleDbError)(error, 'update user data');
        }
    }
    static async deleteUser(id) {
        await this.getUserById(id);
        try {
            await db_1.db.delete(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        }
        catch (error) {
            (0, error_1.handleDbError)(error, 'delete user data');
        }
    }
}
exports.UserService = UserService;
