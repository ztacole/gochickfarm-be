"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheMiddleware = void 0;
const cacheMiddleware = (req, res, next) => {
    if (req.method === "GET") {
        res.set('Cache-Control', 'public, max-age=15');
    }
    next();
};
exports.cacheMiddleware = cacheMiddleware;
