import { Request, Response } from 'express';
import { pool } from '../config/db';
import { AuthRequest } from '../middlewares/auth';

export const getResearchers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM researchers WHERE deleted_at IS NULL ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching researchers' });
  }
};

export const getResearcherById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM researchers WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Researcher not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching researcher' });
  }
};

export const createResearcher = async (req: AuthRequest, res: Response) => {
  const { first_name, second_name, first_lastname, second_lastname, orcid_link, institutional_email, biography, position } = req.body;
  const created_by = req.user?.id;

  try {
    const result = await pool.query(
      `INSERT INTO researchers (first_name, second_name, first_lastname, second_lastname, orcid_link, institutional_email, biography, position, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [first_name, second_name, first_lastname, second_lastname, orcid_link, institutional_email, biography, position, created_by]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating researcher' });
  }
};

export const deleteResearcher = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const modified_by = req.user?.id;

  try {
    // Soft delete
    await pool.query(
      `UPDATE researchers SET deleted_at = CURRENT_TIMESTAMP, modified_by = $1 WHERE id = $2`,
      [modified_by, id]
    );
    res.json({ message: 'Researcher deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting researcher' });
  }
};

export const updateResearcher = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { first_name, second_name, first_lastname, second_lastname, orcid_link, institutional_email, biography, position } = req.body;
  const modified_by = req.user?.id;

  try {
    const result = await pool.query(
      `UPDATE researchers 
       SET first_name = $1, second_name = $2, first_lastname = $3, second_lastname = $4, 
           orcid_link = $5, institutional_email = $6, biography = $7, position = $8, modified_by = $9
       WHERE id = $10 RETURNING *`,
      [first_name, second_name, first_lastname, second_lastname, orcid_link, institutional_email, biography, position, modified_by, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating researcher' });
  }
};
