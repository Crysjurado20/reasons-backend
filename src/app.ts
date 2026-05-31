import express from 'express';
import dotenv from 'dotenv';
import { checkDbConnection } from './config/db';
import { corsMiddleware } from './middlewares/cors';
import authRoutes from './routes/auth.routes';
import researchersRoutes from './routes/researcher.routes';
import projectsRoutes from './routes/project.routes';
import publicationsRoutes from './routes/publication.routes';
import groupsRoutes from './routes/group.routes';
import contactsRoutes from './routes/contact.routes';
import socialNetworksRoutes from './routes/social_network.routes';

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
app.use('/api/groups', groupsRoutes);
app.use('/api/contact', contactsRoutes);
app.use('/api/social-networks', socialNetworksRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('API REASONS está corriendo...');
});

// Start Server
app.listen(PORT, async () => {
  console.log(`Servidor está corriendo en el puerto: ${PORT}`);
  await checkDbConnection();
});

export default app;
