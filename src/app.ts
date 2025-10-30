import express from 'express';
import { errorHandler } from './middleware/error.middleware';
const cors = require('cors');
const dotenv = require('dotenv');

import authMobileRoute from './modules/auth/auth.route.mobile';
import authWebRoute from './modules/auth/auth.route.web';
import animalMobileRoute from './modules/animal/animal.route.mobile';
import animalWebRoute from './modules/animal/animal.route.web';

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
app.use(webPrefix + '/users', animalWebRoute);


// Error Handler Middleware
app.use(errorHandler)

export default app;