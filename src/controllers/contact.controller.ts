import { Request, Response } from 'express';
import { validateContact } from '../schemas/contact.schema';

export class ContactController {
  private contactModel: any;

  constructor({ contactModel }: { contactModel: any }) {
    this.contactModel = contactModel;
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const messages = await this.contactModel.getAll();
      res.json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching contact messages' });
    }
  }

  create = async (req: Request, res: Response) => {
    try {
      const result = validateContact(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error.format() });
      }

      const newMessage = await this.contactModel.create({ input: result.data });
      res.status(201).json(newMessage);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating contact message' });
    }
  }
}
