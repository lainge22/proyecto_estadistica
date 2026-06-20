import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.services'; // Asegúrate de la ruta correcta
import router from '../routes/auth.routes';


export class AuthController {
  
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData = req.body;
      const result = await AuthService.register(userData);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
  
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      await AuthService.forgotPassword(email);
      res.status(200).json({ success: true, message: 'Correo de recuperación enviado' });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, token, newPassword } = req.body;
      await AuthService.resetPassword(email, token, newPassword);
      res.status(200).json({ success: true, message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      next(error);
    }
  }
}

// En lugar de llamar al middleware, usa una función de prueba rápida
router.get('/test-auth', (req, res) => {
  return res.json({ message: "Respuesta directa sin middleware" });
});