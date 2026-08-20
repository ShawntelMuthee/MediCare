import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware.js';
import patientRoutes from './routes/patient.routes.js';
import vitalsRoutes from './routes/vitals.routes.js';
import assessmentRoutes from './routes/assessment.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running' });
});

// API Routes
app.use('/patients', patientRoutes);
app.use('/patients', vitalsRoutes);
app.use('/patients', assessmentRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
