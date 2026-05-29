import { Request, Response } from 'express';
import { pool } from '../config/db';
import { AuthRequest } from '../middlewares/auth';

export const getPublications = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM publications WHERE deleted_at IS NULL ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching publications' });
  }
};

export const getPublicationById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM publications WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Publication not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching publication' });
  }
};

export const createPublication = async (req: AuthRequest, res: Response) => {
  const { title, abstract, doi_link, publication_date } = req.body;
  const created_by = req.user?.id;

  try {
    const result = await pool.query(
      `INSERT INTO publications (title, abstract, doi_link, publication_date, created_by) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, abstract, doi_link, publication_date, created_by]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating publication' });
  }
};

export const deletePublication = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const modified_by = req.user?.id;

  try {
    await pool.query(
      `UPDATE publications SET deleted_at = CURRENT_TIMESTAMP, modified_by = $1 WHERE id = $2`,
      [modified_by, id]
    );
    res.json({ message: 'Publication deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting publication' });
  }
};

export const updatePublication = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, abstract, doi_link, publication_date } = req.body;
  const modified_by = req.user?.id;

  try {
    const result = await pool.query(
      `UPDATE publications 
       SET title = $1, abstract = $2, doi_link = $3, publication_date = $4, modified_by = $5
       WHERE id = $6 RETURNING *`,
      [title, abstract, doi_link, publication_date, modified_by, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating publication' });
  }
};
