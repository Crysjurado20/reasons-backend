import { Router } from 'express';
import { getPublications, getPublicationById, createPublication, deletePublication, updatePublication } from '../controllers/publicationsController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.get('/', getPublications);
router.get('/:id', getPublicationById);
router.post('/', authenticateToken, createPublication);
router.put('/:id', authenticateToken, updatePublication);
router.delete('/:id', authenticateToken, deletePublication);

export default router;
