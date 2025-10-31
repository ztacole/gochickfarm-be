import { Request, Response } from "express";
import { UserService } from "./user.service";
import { asyncHandler } from "../../common/async.handler";
import { UserRequest } from "./user.type";

export class UserController {
    static getAllUsers = asyncHandler(async (req: Request, res: Response) => {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Number(req.query.limit) || 10);
        const search = String(req.query.search || '');
        const role = String(req.query.role || '');
        const { data, meta } = await UserService.getAllUsers(page, limit, search, role);
        res.status(200).json({
            success: true,
            message: "User data has been retrieved successfully!",
            data,
            meta
        });
    });

    static getUserById = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const user = await UserService.getUserById(id);
        res.status(200).json({
            success: true,
            message: "User data has been retrieved successfully!",
            data: user
        });
    });

    static createUser = asyncHandler(async (req: Request, res: Response) => {
        const { full_name, email, password } = req.body as UserRequest;
        const userId = await UserService.createUser({ full_name, email, password });
        res.status(201).json({
            success: true,
            message: "User data has been saved successfully!",
            data: userId
        });
    });

    static updateUser = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const { full_name, email, password } = req.body as UserRequest;
        await UserService.updateUser(id, { full_name, email, password});
        res.status(200).json({
            success: true,
            message: "User data has been updated successfully!"
        });
    });

    static deleteUser = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        await UserService.deleteUser(id);
        res.status(200).json({
            success: true,
            message: "User data has been deleted successfully!"
        });
    });
}