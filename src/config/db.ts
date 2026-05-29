import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

pool.on('error', (err: Error, client: any) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const checkDbConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to the database.');
    client.release();
  } catch (err) {
    console.error('Database connection error:', err);
  }
};
