"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_middleware_1 = require("./middleware/error.middleware");
const cache_middleware_1 = require("./middleware/cache.middleware");
const cors = require('cors');
const dotenv = require('dotenv');
/*
    |--------------------------------------------------------------------------
    | Import Mobile Routes
    |--------------------------------------------------------------------------
*/
const auth_route_mobile_1 = __importDefault(require("./modules/auth/auth.route.mobile"));
const animal_route_mobile_1 = __importDefault(require("./modules/animal/animal.route.mobile"));
const feed_route_mobile_1 = __importDefault(require("./modules/feed/feed.route.mobile"));
const transaction_route_mobile_1 = __importDefault(require("./modules/transaction/transaction.route.mobile"));
const dashboard_route_mobile_1 = __importDefault(require("./modules/dashboard/dashboard.route.mobile"));
const feeding_log_route_mobile_1 = __importDefault(require("./modules/feeding-log/feeding-log.route.mobile"));
const breeding_log_route_mobile_1 = __importDefault(require("./modules/breeding-log/breeding-log.route.mobile"));
/*
    |--------------------------------------------------------------------------
    | Import Web Routes
    |--------------------------------------------------------------------------
*/
const auth_route_web_1 = __importDefault(require("./modules/auth/auth.route.web"));
const animal_route_web_1 = __importDefault(require("./modules/animal/animal.route.web"));
const user_route_web_1 = __importDefault(require("./modules/user/user.route.web"));
const dashboard_route_web_1 = __importDefault(require("./modules/dashboard/dashboard.route.web"));
const feed_route_web_1 = __importDefault(require("./modules/feed/feed.route.web"));
const report_route_web_1 = __importDefault(require("./modules/report/report.route.web"));
dotenv.config();
const app = (0, express_1.default)();
app.use(cors());
app.use(express_1.default.json());
app.use(cache_middleware_1.cacheMiddleware);
/*
    |--------------------------------------------------------------------------
    | Mobile Routes
    | Define a prefix for all mobile routes
    | example: {baseUrl}/gochick-farm/api/v1/mobile/
    |--------------------------------------------------------------------------
*/
const mobilePrefix = '/gochick-farm/api/v1/mobile';
app.use(mobilePrefix + '/auth', auth_route_mobile_1.default);
app.use(mobilePrefix + '/animals', animal_route_mobile_1.default);
app.use(mobilePrefix + '/feeds', feed_route_mobile_1.default);
app.use(mobilePrefix + '/transactions', transaction_route_mobile_1.default);
app.use(mobilePrefix + '/dashboard', dashboard_route_mobile_1.default);
app.use(mobilePrefix + '/feeding-logs', feeding_log_route_mobile_1.default);
app.use(mobilePrefix + '/breeding-logs', breeding_log_route_mobile_1.default);
/*
    |--------------------------------------------------------------------------
    | Web Routes
    | Define a prefix for all web routes
    | example: {baseUrl}/gochick-farm/api/v1/web/
    |--------------------------------------------------------------------------
*/
const webPrefix = '/gochick-farm/api/v1/web';
app.use(webPrefix + '/auth', auth_route_web_1.default);
app.use(webPrefix + '/animals', animal_route_web_1.default);
app.use(webPrefix + '/users', user_route_web_1.default);
app.use(webPrefix + '/dashboard', dashboard_route_web_1.default);
app.use(webPrefix + '/feeds', feed_route_web_1.default);
app.use(webPrefix + '/reports', report_route_web_1.default);
// Error Handler Middleware
app.use(error_middleware_1.errorHandler);
exports.default = app;
