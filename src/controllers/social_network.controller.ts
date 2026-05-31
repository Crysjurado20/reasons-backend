import { Request, Response } from 'express';
import { validateSocialNetwork, validatePartialSocialNetwork } from '../schemas/social_network.schema';

export class SocialNetworkController {
  private socialNetworkModel: any;

  constructor({ socialNetworkModel }: { socialNetworkModel: any }) {
    this.socialNetworkModel = socialNetworkModel;
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const networks = await this.socialNetworkModel.getAll();
      res.json(networks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching social networks' });
    }
  }

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const network = await this.socialNetworkModel.getById({ id });
      
      if (!network) return res.status(404).json({ message: 'Social network not found' });
      
      res.json(network);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching social network' });
    }
  }

  create = async (req: Request, res: Response) => {
    try {
      const result = validateSocialNetwork(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error.format() });
      }

      const newNetwork = await this.socialNetworkModel.create({ input: result.data });
      res.status(201).json(newNetwork);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating social network' });
    }
  }

  update = async (req: Request, res: Response) => {
    try {
      const result = validatePartialSocialNetwork(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error.format() });
      }

      const { id } = req.params;

      const updatedNetwork = await this.socialNetworkModel.update({ id, input: result.data });
      
      if (!updatedNetwork) return res.status(404).json({ message: 'Social network not found' });
      
      res.json(updatedNetwork);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating social network' });
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const result = await this.socialNetworkModel.delete({ id });
      
      if (result === false) return res.status(404).json({ message: 'Social network not found' });
      
      res.json({ message: 'Social network deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting social network' });
    }
  }
}
