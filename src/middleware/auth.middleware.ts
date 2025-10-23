import { Request, NextFunction, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { db } from "../config/db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Token tidak ditemukan!",
        });
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET as string || 'secret';

    try {
        const payload = jwt.verify(token, jwtSecret) as JwtPayload;

        const [user] = await db.select().from(users).where(eq(users.id, Number(payload.id)));
        if (!user || user.session_id !== payload.session_id) {
            return res.status(401).json({
                success: false,
                message: "Token tidak valid atau session telah diganti!",
            });
        }

        req.user = payload;
        next();
    } catch (error: any) {
        return res.status(401).json({
            success: false,
            message: "Token tidak valid atau sudah kadaluwarsa!",
        });
    }
}

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role?.name !== "Admin") {
        return res.status(403).json({
            success: false,
            message: "Akses ditolak! Hanya admin yang dapat mengakses resource ini.",
        });
    }
    next();
}

export const staffMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role?.name !== "Staff") {
        return res.status(403).json({
            success: false,
            message: "Akses ditolak! Hanya staff yang dapat mengakses resource ini.",
        });
    }
    next();
}