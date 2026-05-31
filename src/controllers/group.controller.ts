import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { validateGroup, validatePartialGroup } from '../schemas/group.schema';

export class GroupController {
  private groupModel: any;

  constructor({ groupModel }: { groupModel: any }) {
    this.groupModel = groupModel;
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const groups = await this.groupModel.getAll();
      res.json(groups);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching groups' });
    }
  }

  getStats = async (req: Request, res: Response) => {
    try {
      const stats = await this.groupModel.getStats();
      res.json(stats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching stats' });
    }
  }

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const group = await this.groupModel.getById({ id });
      
      if (group) return res.json(group);
      
      res.status(404).json({ message: 'Group not found' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching group' });
    }
  }

  create = async (req: AuthRequest, res: Response) => {
    try {
      // 1. Validamos los datos con Zod
      const result = validateGroup(req.body);
      
      // En TypeScript con Zod, evaluamos la propiedad 'success'
      if (!result.success) {
        return res.status(400).json({ error: result.error.format() });
      }

      // 2. Extraemos el usuario del middleware de auth
      const createdBy = req.user?.id;

      // 3. Enviamos al modelo la data validada (result.data) y el ID del creador
      const newGroup = await this.groupModel.create({ input: result.data, createdBy });
      res.status(201).json(newGroup);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating group' });
    }
  }

  delete = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const modifiedBy = req.user?.id;

      const result = await this.groupModel.delete({ id, modifiedBy });
      
      if (result === false) return res.status(404).json({ message: 'Group not found' });
      
      res.json({ message: 'Group deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting group' });
    }
  }

  update = async (req: AuthRequest, res: Response) => {
    try {
      const result = validatePartialGroup(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error.format() });
      }

      const { id } = req.params;
      const modifiedBy = req.user?.id;

      const updatedGroup = await this.groupModel.update({ id, input: result.data, modifiedBy });
      
      if (!updatedGroup) return res.status(404).json({ message: 'Group not found' });
      
      res.json(updatedGroup);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating group' });
    }
  }
}
