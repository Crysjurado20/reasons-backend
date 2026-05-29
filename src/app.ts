import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkDbConnection } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

import authRoutes from './routes/authRoutes';
import researchersRoutes from './routes/researchersRoutes';
import projectsRoutes from './routes/projectsRoutes';
import publicationsRoutes from './routes/publicationsRoutes';

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/researchers', researchersRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/publications', publicationsRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('REASONS API is running...');
});

// Start Server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await checkDbConnection();
});

export default app;
