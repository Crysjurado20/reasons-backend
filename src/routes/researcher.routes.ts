import { Router } from 'express';
import { getResearchers, getResearcherById, createResearcher, deleteResearcher, updateResearcher } from '../controllers/researchersController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.get('/', getResearchers);
router.get('/:id', getResearcherById);
router.post('/', authenticateToken, createResearcher);
router.put('/:id', authenticateToken, updateResearcher);
router.delete('/:id', authenticateToken, deleteResearcher);

export default router;
