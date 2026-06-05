import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { validatePublication, validatePartialPublication } from '../schemas/publication.schema';

export class PublicationController {
  private publicationModel: any;

  constructor({ publicationModel }: { publicationModel: any }) {
    this.publicationModel = publicationModel;
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const publications = await this.publicationModel.getAll();
      res.json(publications);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching publications' });
    }
  }

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const publication = await this.publicationModel.getById({ id });
      
      if (publication) return res.json(publication);
      
      res.status(404).json({ message: 'Publication not found' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching publication' });
    }
  }

  create = async (req: AuthRequest, res: Response) => {
    try {
      const result = validatePublication(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error.format() });
      }

      const createdBy = req.user?.id;

      const newPublication = await this.publicationModel.create({ input: result.data, createdBy });
      res.status(201).json(newPublication);
    } catch (error: any) {
      console.error(error);
      if (error.code === 'P2003') {
        return res.status(400).json({ message: 'Uno de los identificadores relacionados (ej. investigador) no existe en la base de datos.' });
      }
      res.status(500).json({ message: 'Error creating publication' });
    }
  }

  delete = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const modifiedBy = req.user?.id;

      const result = await this.publicationModel.delete({ id, modifiedBy });
      
      if (result === false) return res.status(404).json({ message: 'Publication not found' });
      
      res.json({ message: 'Publication deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting publication' });
    }
  }

  update = async (req: AuthRequest, res: Response) => {
    try {
      const result = validatePartialPublication(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error.format() });
      }

      const { id } = req.params;
      const modifiedBy = req.user?.id;

      const updatedPublication = await this.publicationModel.update({ id, input: result.data, modifiedBy });
      
      if (!updatedPublication) return res.status(404).json({ message: 'Publication not found' });
      
      res.json(updatedPublication);
    } catch (error: any) {
      console.error(error);
      if (error.code === 'P2003') {
        return res.status(400).json({ message: 'Uno de los identificadores relacionados (ej. investigador) no existe en la base de datos.' });
      }
      res.status(500).json({ message: 'Error updating publication' });
    }
  }
}
