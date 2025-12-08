"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const async_handler_1 = require("../../common/async.handler");
class UserController {
}
exports.UserController = UserController;
_a = UserController;
UserController.getAllUsers = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 10);
    const search = String(req.query.search || '');
    const role = String(req.query.role || '');
    const { data, meta } = await user_service_1.UserService.getAllUsers(page, limit, search, role);
    res.status(200).json({
        success: true,
        message: "User data has been retrieved successfully!",
        data,
        meta
    });
});
UserController.getUserById = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const id = Number(req.params.id);
    const user = await user_service_1.UserService.getUserById(id);
    res.status(200).json({
        success: true,
        message: "User data has been retrieved successfully!",
        data: user
    });
});
UserController.createUser = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { full_name, email, password } = req.body;
    const userId = await user_service_1.UserService.createUser({ full_name, email, password });
    res.status(201).json({
        success: true,
        message: "User data has been saved successfully!",
        data: userId
    });
});
UserController.updateUser = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const id = Number(req.params.id);
    const { full_name, email, password } = req.body;
    await user_service_1.UserService.updateUser(id, { full_name, email, password });
    res.status(200).json({
        success: true,
        message: "User data has been updated successfully!"
    });
});
UserController.deleteUser = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const id = Number(req.params.id);
    await user_service_1.UserService.deleteUser(id);
    res.status(200).json({
        success: true,
        message: "User data has been deleted successfully!"
    });
});
