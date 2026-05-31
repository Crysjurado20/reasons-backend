import { Router } from 'express';
import { ResearcherController } from '../controllers/researcher.controller';
import { ResearcherModel } from '../models/researcher.model';
import { authenticateToken } from '../middlewares/auth';

const researcherRouter = Router();
const researcherController = new ResearcherController({ researcherModel: ResearcherModel });

researcherRouter.get('/', researcherController.getAll);
researcherRouter.get('/:id', researcherController.getById);
researcherRouter.post('/', authenticateToken, researcherController.create);
researcherRouter.delete('/:id', authenticateToken, researcherController.delete);
researcherRouter.patch('/:id', authenticateToken, researcherController.update);

export default researcherRouter;
