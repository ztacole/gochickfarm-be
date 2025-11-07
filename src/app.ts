import express from 'express';
import { errorHandler } from './middleware/error.middleware';
const cors = require('cors');
const dotenv = require('dotenv');

/*
    |--------------------------------------------------------------------------
    | Import Mobile Routes
    |--------------------------------------------------------------------------
*/
import authMobileRoute from './modules/auth/auth.route.mobile';
import animalMobileRoute from './modules/animal/animal.route.mobile';

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

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/*
    |--------------------------------------------------------------------------
    | Mobile Routes
    |--------------------------------------------------------------------------
*/
const mobilePrefix = '/gochick-farm/api/v1/mobile';
app.use(mobilePrefix + '/auth', authMobileRoute);
app.use(mobilePrefix + '/animals', animalMobileRoute);


/*
    |--------------------------------------------------------------------------
    | Web Routes
    |--------------------------------------------------------------------------
*/
const webPrefix = '/gochick-farm/api/v1/web';
app.use(webPrefix + '/auth', authWebRoute);
app.use(webPrefix + '/animals', animalWebRoute);
app.use(webPrefix + '/users', userWebRoute);
app.use(webPrefix + '/dashboard', dashboardWebRoute);
app.use(webPrefix + '/feeds', feedWebRoute);


// Error Handler Middleware
app.use(errorHandler)

export default app;