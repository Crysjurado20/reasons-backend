import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { ProjectModel } from '../models/project.model';
import { authenticateToken } from '../middlewares/auth';

const projectRouter = Router();
const projectController = new ProjectController({ projectModel: ProjectModel });

projectRouter.get('/', projectController.getAll);
projectRouter.get('/:id', projectController.getById);
projectRouter.post('/', authenticateToken, projectController.create);
projectRouter.delete('/:id', authenticateToken, projectController.delete);
projectRouter.patch('/:id', authenticateToken, projectController.update);

export default projectRouter;
