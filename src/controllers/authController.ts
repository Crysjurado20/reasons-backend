import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db';
import nodemailer from 'nodemailer';
import crypto from 'node:crypto';
import { AuthRequest } from '../middlewares/auth';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: Number.parseInt(process.env.SMTP_PORT || '587', 10),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }

    const user = userResult.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      res.status(200).json({ message: 'Si el correo existe, se ha enviado un enlace para restablecer la contraseña' });
      return;
    }

    const user = userResult.rows[0];
    const plainToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(plainToken, 10);
    
    await pool.query('UPDATE users SET token = $1 WHERE id = $2', [hashedToken, user.id]);

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:4200'}/reset-password/${plainToken}?email=${encodeURIComponent(email)}`;
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"App Reasons" <noreply@appreasons.com>',
      to: email,
      subject: 'Restablecer contraseña',
      html: `<p>Hola ${user.name || 'usuario'},</p><p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:</p><p><a href="${resetLink}">Restablecer contraseña</a></p>`,
    });

    res.status(200).json({ message: 'Si el correo existe, se ha enviado un enlace para restablecer la contraseña' });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const token = req.params.token as string;
  const email = req.query.email as string;
  const newPassword = req.body.password;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0 || !userResult.rows[0].token) {
      res.status(400).json({ message: 'Token inválido' });
      return;
    }

    const user = userResult.rows[0];
    const isValidToken = await bcrypt.compare(token, user.token);
    
    if (!isValidToken) {
      res.status(400).json({ message: 'Token inválido' });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await pool.query('UPDATE users SET password = $1, token = NULL WHERE id = $2', [hashedPassword, user.id]);

    res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const changeEmail = async (req: AuthRequest, res: Response): Promise<void> => {
  const { currentPassword, newEmail } = req.body;
  const userId = req.user?.id;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    
    if (userResult.rows.length === 0) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    
    if (!validPassword) {
      res.status(401).json({ message: 'Contraseña actual incorrecta' });
      return;
    }

    const emailExistResult = await pool.query('SELECT * FROM users WHERE email = $1', [newEmail]);
    if (emailExistResult.rows.length > 0) {
      res.status(400).json({ message: 'El correo electrónico ya está en uso' });
      return;
    }

    await pool.query('UPDATE users SET email = $1 WHERE id = $2', [newEmail, userId]);

    res.status(200).json({ message: 'Correo electrónico actualizado correctamente' });
  } catch (error) {
    console.error('Error in changeEmail:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?.id;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    
    if (userResult.rows.length === 0) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    
    if (!validPassword) {
      res.status(401).json({ message: 'Contraseña actual incorrecta' });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);

    res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error in changePassword:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
