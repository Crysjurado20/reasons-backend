import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validateLogin } from '../schemas/auth.schema';

export class AuthController {
  private authModel: any;

  constructor({ authModel }: { authModel: any }) {
    this.authModel = authModel;
  }

  login = async (req: Request, res: Response) => {
    try {
      const result = validateLogin(req.body);

      if (!result.success) {
        return res.status(400).json({ error: result.error.format() });
      }

      const { email, password } = result.data;

      const user = await this.authModel.getUserByEmail({ email });
      
      if (!user || user.deleted_at) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      
      if (!validPassword) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      // Generar Access Token (Dura 15 minutos)
      const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '15m' }
      );

      // Generar Refresh Token (Dura 7 días)
      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );

      // Aplicar hash al Refresh Token antes de guardarlo
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

      // Guardar el Refresh Token hasheado en la base de datos
      await this.authModel.updateUserToken({ id: user.id, token: hashedRefreshToken });

      res.json({
        message: 'Login exitoso',
        accessToken,
        refreshToken,
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

  refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token requerido' });
    }

    try {
      // 1. Verificar el token firmado
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'secret') as { id: number };

      // 2. Buscar al usuario por ID
      const user = await this.authModel.getUserById({ id: decoded.id });

      if (!user || !user.token) {
        return res.status(403).json({ message: 'Refresh token inválido o revocado' });
      }

      // 3. Comparar el token entrante con el hash guardado en DB
      const isMatch = await bcrypt.compare(refreshToken, user.token);
      if (!isMatch) {
        return res.status(403).json({ message: 'Refresh token inválido o revocado' });
      }

      // 4. Generar un NUEVO Access Token
      const newAccessToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '15m' }
      );

      res.json({ accessToken: newAccessToken });

    } catch (error) {
      return res.status(403).json({ message: 'Refresh token expirado o inválido' });
    }
  };
}
