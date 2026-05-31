import { Router } from 'express';
import { GroupController } from '../controllers/group.controller';
import { GroupModel } from '../models/group.model';
import { authenticateToken } from '../middlewares/auth';

const groupRouter = Router();
const groupController = new GroupController({ groupModel: GroupModel });

groupRouter.get('/', groupController.getAll);
groupRouter.get('/stats', groupController.getStats);
groupRouter.get('/:id', groupController.getById);
groupRouter.post('/', authenticateToken, groupController.create);
groupRouter.delete('/:id', authenticateToken, groupController.delete);
groupRouter.patch('/:id', authenticateToken, groupController.update);

export default groupRouter;
