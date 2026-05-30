import express from 'express';
import dotenv from 'dotenv';
import { checkDbConnection } from './config/db';
import { corsMiddleware } from './middlewares/cors';
import authRoutes from './routes/auth.routes';
import researchersRoutes from './routes/researcher.routes';
import projectsRoutes from './routes/project.routes';
import publicationsRoutes from './routes/publication.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;



// Middlewares
app.use(corsMiddleware());
app.use(express.json());
app.disable('x-powered-by');

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
