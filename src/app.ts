import express from 'express';
import { errorHandler } from './middleware/error.middleware';
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Main

//

app.use(errorHandler)

export default app;