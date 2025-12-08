"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const async_handler_1 = require("../../common/async.handler");
class AuthController {
}
exports.AuthController = AuthController;
_a = AuthController;
AuthController.loginWeb = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password must be filled!",
        });
    }
    const result = await auth_service_1.AuthService.login(email, password, "Admin");
    res.status(200).json({
        success: true,
        message: "Login successfully!",
        data: result
    });
});
AuthController.loginMobile = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password must be filled!",
        });
    }
    const result = await auth_service_1.AuthService.login(email, password);
    res.status(200).json({
        success: true,
        message: "Login successfully!",
        data: result
    });
});
AuthController.me = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const result = await auth_service_1.AuthService.me(user.id);
    res.status(200).json({
        success: true,
        message: "User data has been retrieved successfully!",
        data: result
    });
});
