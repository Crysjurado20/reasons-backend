import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthModel } from '../models/auth.model';

const authRouter = Router();
const authController = new AuthController({ authModel: AuthModel });

authRouter.post('/login', authController.login);
authRouter.post('/refresh', authController.refresh);

export default authRouter;
