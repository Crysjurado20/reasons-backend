import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extendemos la interfaz Request de Express para que acepte nuestra propiedad 'user'
export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Capturamos el header de autorización
  const authHeader = req.headers.authorization;

  // Verificamos que exista y que comience con la palabra "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Acceso denegado. Token no proporcionado o formato inválido.' });
    return;
  }

  // Extraemos solo el token
  const token = authHeader.split(' ')[1];

  try {
    // Desencriptamos y validamos el token usando la clave secreta
    const secret = process.env.JWT_SECRET || 'secret';
    const decoded = jwt.verify(token, secret) as { id: number; role: string };

    // Inyectamos los datos del usuario en el objeto Request
    req.user = decoded;

    // Permitimos que la petición continúe
    next();
  } catch (error) {
    // Si el token expiró o fue modificado
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};
