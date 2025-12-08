"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const async_handler_1 = require("../../common/async.handler");
const report_service_1 = require("./report.service");
const error_1 = require("../../common/error");
class ReportController {
}
exports.ReportController = ReportController;
_a = ReportController;
ReportController.getReportTransaction = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const type = req.query.type;
    if (type && type !== "Pemasukan" && type !== "Pengeluaran")
        throw new error_1.ValidationError("Invalid type! Only 'Pemasukan' or 'Pengeluaran' are allowed.");
    const transactions = await report_service_1.ReportService.getReportTransaction(type);
    res.status(200).json({
        success: true,
        message: "Report data has been retrieved successfully!",
        data: transactions
    });
});
ReportController.getAnimalHarvestReport = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const search = req.query.search;
    const animals = await report_service_1.ReportService.getAnimalHarvestReport(search);
    res.status(200).json({
        success: true,
        message: "Animal harvest report data has been retrieved successfully!",
        data: animals
    });
});
ReportController.getAnimalSickReport = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const search = req.query.search;
    const animals = await report_service_1.ReportService.getAnimalSickReport(search);
    res.status(200).json({
        success: true,
        message: "Animal sick report data has been retrieved successfully!",
        data: animals
    });
});
