import { db } from "../../config/db";
import { users, roles } from "../../../drizzle/schema";
import { UserRequest, UserResponse } from "./user.type";
import { eq, like } from "drizzle-orm";
import { AppError, NotFoundError } from "../../common/error";
import bcrypt from "bcryptjs";
import { Meta } from "../../common/meta.type";

export class UserService {
    static async getAllUsers(page: number = 1, limit: number = 10, search: string = '', role: string = ''): Promise<{ data: UserResponse[], meta: Meta }> {
        const usersQuery = db.select({
            id: users.id,
            full_name: users.full_name,
            email: users.email,
            role: roles
        }).from(users)
            .innerJoin(roles, eq(users.role_id, roles.id))
            .limit(limit)
            .offset((page - 1) * limit);

        if (search) {
            usersQuery.where(like(users.full_name, `%${search}%`));
        }

        if (role) {
            usersQuery.where(eq(roles.name, role));
        }

        const [totalItemsResult] = await db.select({
            count: db.$count(users)
        }).from(users);
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
        }
    }

    static async getUserById(id: number) {
        const [user] = await db.select({
            id: users.id,
            full_name: users.full_name,
            email: users.email,
            role: roles
        }).from(users)
            .innerJoin(roles, eq(users.role_id, roles.id))
            .where(eq(users.id, id));
        if (!user) throw new NotFoundError('User not found!');
        return user;
    }

    static async createUser(data: UserRequest) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const [staffRole] = await db.select().from(roles).where(eq(roles.name, 'Staff'));
        try {
            const [newUserId] = await db.insert(users).values({
                full_name: data.full_name,
                email: data.email,
                password: hashedPassword,
                role_id: staffRole.id
            }).$returningId();

            return Number(newUserId.id);
        } catch (error: any) {
            if (error.code === '23505') {
                throw new AppError('Email sudah terdaftar!', 400);
            }
        }
    }

    static async updateUser(id: number, data: Partial<UserRequest>): Promise<void> {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        if (!user) throw new NotFoundError('User not found!');

        try {
            await db.update(users).set({
                full_name: data.full_name ?? user.full_name,
                email: data.email ?? user.email,
                password: data.password ? await bcrypt.hash(data.password, 10) : user.password
            }).where(eq(users.id, id));
        } catch (error) {
            throw new AppError('Failed to update user data.', 500);
        }
    }

    static async deleteUser(id: number): Promise<void> {
        await this.getUserById(id);

        try {
            await db.delete(users).where(eq(users.id, id));
        } catch (error) {
            throw new AppError('Failed to delete user data.', 500);
        }
    }
}