import { Request, Response, NextFunction } from 'express';

// Express reconoce este middleware como de error porque tiene 4 argumentos
export const errorHandler = (
  err: any, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  console.error('❌ Error capturado:', err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    success: false,
    message: message,
    // Solo enviamos el stack en desarrollo por seguridad
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};