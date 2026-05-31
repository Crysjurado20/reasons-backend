import { Router } from 'express';
import { PublicationController } from '../controllers/publication.controller';
import { PublicationModel } from '../models/publication.model';
import { authenticateToken } from '../middlewares/auth';

const publicationRouter = Router();
const publicationController = new PublicationController({ publicationModel: PublicationModel });

publicationRouter.get('/', publicationController.getAll);
publicationRouter.get('/:id', publicationController.getById);
publicationRouter.post('/', authenticateToken, publicationController.create);
publicationRouter.delete('/:id', authenticateToken, publicationController.delete);
publicationRouter.patch('/:id', authenticateToken, publicationController.update);

export default publicationRouter;
