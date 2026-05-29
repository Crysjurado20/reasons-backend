import { Router } from 'express';
import { getProjects, getProjectById, createProject, deleteProject, updateProject } from '../controllers/projectsController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', authenticateToken, createProject);
router.put('/:id', authenticateToken, updateProject);
router.delete('/:id', authenticateToken, deleteProject);

export default router;
