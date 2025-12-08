import express from 'express';
import { errorHandler } from './middleware/error.middleware';
import { cacheMiddleware } from './middleware/cache.middleware';
const cors = require('cors');
const dotenv = require('dotenv');

/*
    |--------------------------------------------------------------------------
    | Import Mobile Routes
    |--------------------------------------------------------------------------
*/
import authMobileRoute from './modules/auth/auth.route.mobile';
import animalMobileRoute from './modules/animal/animal.route.mobile';
import feedMobileRoute from './modules/feed/feed.route.mobile';
import transactionMobileRoute from './modules/transaction/transaction.route.mobile';
import dashboardMobileRoute from './modules/dashboard/dashboard.route.mobile';
import feedingLogMobileRoute from './modules/feeding-log/feeding-log.route.mobile';
import breedingLogMobileRoute from './modules/breeding-log/breeding-log.route.mobile';

/*
    |--------------------------------------------------------------------------
    | Import Web Routes
    |--------------------------------------------------------------------------
*/
import authWebRoute from './modules/auth/auth.route.web';
import animalWebRoute from './modules/animal/animal.route.web';
import userWebRoute from './modules/user/user.route.web';
import dashboardWebRoute from './modules/dashboard/dashboard.route.web';
import feedWebRoute from './modules/feed/feed.route.web';
import reportWebRoute from './modules/report/report.route.web';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cacheMiddleware);

/*
    |--------------------------------------------------------------------------
    | Mobile Routes
    | Define a prefix for all mobile routes
    | example: {baseUrl}/gochick-farm/api/v1/mobile/
    |--------------------------------------------------------------------------
*/
const mobilePrefix = '/api/v1/mobile';
app.use(mobilePrefix + '/auth', authMobileRoute);
app.use(mobilePrefix + '/animals', animalMobileRoute);
app.use(mobilePrefix + '/feeds', feedMobileRoute);
app.use(mobilePrefix + '/transactions', transactionMobileRoute);
app.use(mobilePrefix + '/dashboard', dashboardMobileRoute);
app.use(mobilePrefix + '/feeding-logs', feedingLogMobileRoute);
app.use(mobilePrefix + '/breeding-logs', breedingLogMobileRoute);


/*
    |--------------------------------------------------------------------------
    | Web Routes
    | Define a prefix for all web routes
    | example: {baseUrl}/gochick-farm/api/v1/web/
    |--------------------------------------------------------------------------
*/
const webPrefix = '/api/v1/web';
app.use(webPrefix + '/auth', authWebRoute);
app.use(webPrefix + '/animals', animalWebRoute);
app.use(webPrefix + '/users', userWebRoute);
app.use(webPrefix + '/dashboard', dashboardWebRoute);
app.use(webPrefix + '/feeds', feedWebRoute);
app.use(webPrefix + '/reports', reportWebRoute);


// Error Handler Middleware
app.use(errorHandler)

export default app;