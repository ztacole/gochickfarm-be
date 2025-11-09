import { Request, Response, NextFunction } from "express";

export const cacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === "GET") {
        res.set('Cache-Control', 'public, max-age=15');
    }
    next();
}