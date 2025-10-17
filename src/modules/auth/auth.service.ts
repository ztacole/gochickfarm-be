import { and, eq } from "drizzle-orm";
import { roles, users } from "../../../drizzle/schema";
import { db } from "../../config/db";
import { UnauthorizedError } from "../../common/error";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { JwtPayload } from "./auth.type";

export class AuthService {
    static async login(email: string, password: string, role?: string) {
        const [user] = await db.select({
            id: users.id,
            email: users.email,
            password: users.password,
            full_name: users.full_name,
            role: roles
        }).from(users).innerJoin(roles, eq(users.role_id, roles.id)).where(eq(users.email, email));
        if (!user) throw new UnauthorizedError('Email atau password tidak valid!')
        if (!await bcrypt.compare(password, user.password)) throw new UnauthorizedError('Email atau password tidak valid!')
        if (role && user.role.name !== role) throw new UnauthorizedError('Anda tidak memiliki akses!')
        
        const token = this.generateToken(user);

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

    static async me(userId: number) {
        const [user] = await db.select({
            id: users.id,
            email: users.email,
            full_name: users.full_name,
            role: roles
        }).from(users).innerJoin(roles, eq(users.role_id, roles.id)).where(eq(users.id, userId));
        if (!user) throw new UnauthorizedError('User tidak ditemukan!')
        return user;
    }

    private static generateToken(user: JwtPayload) {
        const jwtSecret = process.env.JWT_SECRET as string || 'secret';
        return jwt.sign(user, jwtSecret, { expiresIn: '7d' });
    }
}