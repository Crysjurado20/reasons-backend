import { Request, Response } from 'express';
import { pool } from '../config/db';
import { AuthRequest } from '../middlewares/auth';

export const getProjects = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM projects WHERE deleted_at IS NULL ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM projects WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching project' });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  const { title, description, status, start_date, end_date } = req.body;
  const created_by = req.user?.id;

  try {
    const result = await pool.query(
      `INSERT INTO projects (title, description, status, start_date, end_date, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, status || 'ACTIVE', start_date, end_date, created_by]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating project' });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const modified_by = req.user?.id;

  try {
    await pool.query(
      `UPDATE projects SET deleted_at = CURRENT_TIMESTAMP, modified_by = $1 WHERE id = $2`,
      [modified_by, id]
    );
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting project' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, description, status, start_date, end_date } = req.body;
  const modified_by = req.user?.id;

  try {
    const result = await pool.query(
      `UPDATE projects 
       SET title = $1, description = $2, status = $3, start_date = $4, end_date = $5, modified_by = $6
       WHERE id = $7 RETURNING *`,
      [title, description, status, start_date, end_date, modified_by, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating project' });
  }
};
