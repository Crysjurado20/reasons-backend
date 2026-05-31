import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { validateProject, validatePartialProject } from '../schemas/project.schema';

export class ProjectController {
  private projectModel: any;

  constructor({ projectModel }: { projectModel: any }) {
    this.projectModel = projectModel;
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const projects = await this.projectModel.getAll();
      res.json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching projects' });
    }
  }

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const project = await this.projectModel.getById({ id });
      
      if (project) return res.json(project);
      
      res.status(404).json({ message: 'Project not found' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching project' });
    }
  }

  create = async (req: AuthRequest, res: Response) => {
    try {
      // 1. Validamos los datos con Zod
      const result = validateProject(req.body);
      
      // En TypeScript con Zod, evaluamos la propiedad 'success'
      if (!result.success) {
        return res.status(400).json({ error: result.error.format() });
      }

      // 2. Extraemos el usuario del middleware de auth
      const createdBy = req.user?.id;

      // 3. Enviamos al modelo la data validada (result.data) y el ID del creador
      const newProject = await this.projectModel.create({ input: result.data, createdBy });
      res.status(201).json(newProject);
    } catch (error: any) {
      console.error(error);
      if (error.code === 'P2003') {
        return res.status(400).json({ message: 'Uno de los identificadores relacionados (ej. investigador) no existe en la base de datos.' });
      }
      res.status(500).json({ message: 'Error creating project' });
    }
  }

  delete = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const modifiedBy = req.user?.id;

      const result = await this.projectModel.delete({ id, modifiedBy });
      
      if (result === false) return res.status(404).json({ message: 'Project not found' });
      
      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting project' });
    }
  }

  update = async (req: AuthRequest, res: Response) => {
    try {
      const result = validatePartialProject(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error.format() });
      }

      const { id } = req.params;
      const modifiedBy = req.user?.id;

      const updatedProject = await this.projectModel.update({ id, input: result.data, modifiedBy });
      
      if (!updatedProject) return res.status(404).json({ message: 'Project not found' });
      
      res.json(updatedProject);
    } catch (error: any) {
      console.error(error);
      if (error.code === 'P2003') {
        return res.status(400).json({ message: 'Uno de los identificadores relacionados (ej. investigador) no existe en la base de datos.' });
      }
      res.status(500).json({ message: 'Error updating project' });
    }
  }
}