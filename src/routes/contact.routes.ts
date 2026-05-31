import { Router } from 'express';
import { ContactController } from '../controllers/contact.controller';
import { ContactModel } from '../models/contact.model';

const contactRouter = Router();
const contactController = new ContactController({ contactModel: ContactModel });

// Endpoints sin protección (públicos)
contactRouter.get('/', contactController.getAll);
contactRouter.post('/', contactController.create);

export default contactRouter;
