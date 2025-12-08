"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const async_handler_1 = require("../../common/async.handler");
const dashboard_service_1 = require("./dashboard.service");
class DashboardController {
}
exports.DashboardController = DashboardController;
_a = DashboardController;
DashboardController.getWebDashboardData = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await dashboard_service_1.DashboardService.getWebDashboardData();
    res.status(200).json({
        success: true,
        message: "Web dashboard data has been retrieved successfully!",
        data
    });
});
DashboardController.getTransactionDashboardData = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await dashboard_service_1.DashboardService.getTransactionDashboardData();
    res.status(200).json({
        success: true,
        message: "Transaction dashboard data has been retrieved successfully!",
        data
    });
});
DashboardController.getGraphDashboardData = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const year = Number(req.query.year ?? new Date().getFullYear());
    const data = await dashboard_service_1.DashboardService.getGraphDashboardData(year);
    res.status(200).json({
        success: true,
        message: "Graph dashboard data has been retrieved successfully!",
        data
    });
});
DashboardController.getMobileDashboardData = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await dashboard_service_1.DashboardService.getMobileDashboardData();
    res.status(200).json({
        success: true,
        message: "Mobile dashboard data has been retrieved successfully!",
        data
    });
});
