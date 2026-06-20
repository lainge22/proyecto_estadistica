import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

// Mantenemos la extensión de Request aquí para que sea un archivo autocontenido
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Obtener cabecera
    const authHeader = req.headers.authorization;

    // 2. Validación estricta de presencia y formato
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'Acceso denegado: No se proporcionó token de autenticación' 
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Formato de token inválido. Use: Bearer <token>' 
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token); // Usa tu utilidad verificada
    req.user = decoded;
    next();
  } catch (error: any) {
    // Manejo específico de errores de autenticación
    console.error('Error en autenticación:', error.message);
    
    return res.status(403).json({ 
      success: false, 
      message: 'Token expirado o inválido. Inicie sesión nuevamente.',
      error: error.message 
    });
  }
};