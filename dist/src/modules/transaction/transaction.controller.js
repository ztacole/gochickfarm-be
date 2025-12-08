"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const async_handler_1 = require("../../common/async.handler");
const transaction_service_1 = require("./transaction.service");
class TransactionController {
}
exports.TransactionController = TransactionController;
_a = TransactionController;
TransactionController.getAll = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 10);
    const type = req.query.type;
    const { data, meta } = await transaction_service_1.TransactionService.getAll(page, limit, type);
    res.status(200).json({
        success: true,
        message: "Transaction data has been retrieved successfully!",
        data: data,
        meta: meta
    });
});
TransactionController.create = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const user = req.user;
    const transactionData = req.body;
    const result = await transaction_service_1.TransactionService.create(transactionData, user);
    res.status(201).json({
        success: true,
        message: "Transaction has been created successfully!",
        data: result
    });
});
TransactionController.getById = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const id = Number(req.params.id);
    const result = await transaction_service_1.TransactionService.getById(id);
    res.status(200).json({
        success: true,
        message: "Transaction detail has been retrieved successfully!",
        data: result
    });
});
