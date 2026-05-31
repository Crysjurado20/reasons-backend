import { Router } from 'express';
import { SocialNetworkController } from '../controllers/social_network.controller';
import { SocialNetworkModel } from '../models/social_network.model';
import { authenticateToken } from '../middlewares/auth';

const socialNetworkRouter = Router();
const socialNetworkController = new SocialNetworkController({ socialNetworkModel: SocialNetworkModel });

// Endpoints públicos
socialNetworkRouter.get('/', socialNetworkController.getAll);
socialNetworkRouter.get('/:id', socialNetworkController.getById);

// Endpoints protegidos para administrador
socialNetworkRouter.post('/', authenticateToken, socialNetworkController.create);
socialNetworkRouter.patch('/:id', authenticateToken, socialNetworkController.update);
socialNetworkRouter.delete('/:id', authenticateToken, socialNetworkController.delete);

export default socialNetworkRouter;
