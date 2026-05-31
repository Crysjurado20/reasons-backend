import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { validateResearcher, validatePartialResearcher } from '../schemas/researcher.schema';

export class ResearcherController {
  private researcherModel: any;

  constructor({ researcherModel }: { researcherModel: any }) {
    this.researcherModel = researcherModel;
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const researchers = await this.researcherModel.getAll();
      res.json(researchers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching researchers' });
    }
  }

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const researcher = await this.researcherModel.getById({ id });
      
      if (researcher) return res.json(researcher);
      
      res.status(404).json({ message: 'Researcher not found' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching researcher' });
    }
  }

  create = async (req: AuthRequest, res: Response) => {
    try {
      const result = validateResearcher(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error.format() });
      }

      const createdBy = req.user?.id;

      const newResearcher = await this.researcherModel.create({ input: result.data, createdBy });
      res.status(201).json(newResearcher);
    } catch (error: any) {
      console.error(error);
      if (error.code === 'P2002') {
        return res.status(409).json({ message: 'El correo institucional proporcionado ya se encuentra registrado.' });
      }
      res.status(500).json({ message: 'Error creating researcher' });
    }
  }

  delete = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const modifiedBy = req.user?.id;

      const result = await this.researcherModel.delete({ id, modifiedBy });
      
      if (result === false) return res.status(404).json({ message: 'Researcher not found' });
      
      res.json({ message: 'Researcher deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting researcher' });
    }
  }

  update = async (req: AuthRequest, res: Response) => {
    try {
      const result = validatePartialResearcher(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error.format() });
      }

      const { id } = req.params;
      const modifiedBy = req.user?.id;

      const updatedResearcher = await this.researcherModel.update({ id, input: result.data, modifiedBy });
      
      if (!updatedResearcher) return res.status(404).json({ message: 'Researcher not found' });
      
      res.json(updatedResearcher);
    } catch (error: any) {
      console.error(error);
      if (error.code === 'P2002') {
        return res.status(409).json({ message: 'El correo institucional proporcionado ya se encuentra registrado.' });
      }
      res.status(500).json({ message: 'Error updating researcher' });
    }
  }
}
