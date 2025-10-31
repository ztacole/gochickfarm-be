import { eq } from "drizzle-orm";
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
        if (!user) throw new UnauthorizedError('Invalid credentials!')
        if (!await bcrypt.compare(password, user.password)) throw new UnauthorizedError('Invalid credentials!')
        if (role && user.role.name !== role) throw new UnauthorizedError('You are not authorized!')
        
        const token = await this.generateToken(user as JwtPayload);

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
        if (!user) throw new UnauthorizedError('Invalid token!')
        return user;
    }

    private static async generateToken(user: JwtPayload) {
        const jwtSecret = process.env.JWT_SECRET as string || 'secret';

        const sessionId = crypto.randomUUID();
        await db.update(users).set({ session_id: sessionId }).where(eq(users.id, user.id));
        user.session_id = sessionId;

        return jwt.sign(user, jwtSecret, { expiresIn: '7d' });
    }
}