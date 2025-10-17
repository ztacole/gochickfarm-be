import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { LoginRequest } from "./auth.type";
import { asyncHandler } from "../../common/async.handler";
import { JwtPayload } from "jsonwebtoken";

export class AuthController {
    static loginWeb = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body as LoginRequest;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email dan password harus diisi!",
            })
        }
        const result = await AuthService.login(email, password, "Admin");

        res.status(200).json({
            success: true,
            message: "Login berhasil!",
            data: result
        });
    })

    static loginMobile = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body as LoginRequest;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email dan password harus diisi!",
            })
        }
        const result = await AuthService.login(email, password);

        res.status(200).json({
            success: true,
            message: "Login berhasil!",
            data: result
        });
    })

    static me = asyncHandler(async (req: Request, res: Response) => {
        const user = req.user as JwtPayload;
        const result = await AuthService.me(user.id);
        res.status(200).json({
            success: true,
            message: "Data user berhasil diambil!",
            data: result
        });
    })
}