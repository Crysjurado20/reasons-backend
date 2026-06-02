import { Router } from 'express';
import { login, forgotPassword, resetPassword, changeEmail, changePassword } from '../controllers/authController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/change-email', authenticateToken, changeEmail);
router.post('/change-password', authenticateToken, changePassword);

export default router;
