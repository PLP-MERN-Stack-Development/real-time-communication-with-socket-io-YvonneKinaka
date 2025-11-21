import express from 'express';
import { setRoutes } from './routes/index';
import { errorHandler } from './middleware/index';

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up routes
setRoutes(app);

// Error handling middleware
app.use(errorHandler);

export default app;