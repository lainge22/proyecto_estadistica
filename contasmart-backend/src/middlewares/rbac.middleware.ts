import { Request, Response, NextFunction } from 'express';


export const authorizeRoles = (allowedRoles: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    
    // Ahora TypeScript sabe que 'req.user' existe gracias a la declaración global
    if (!req.user || !allowedRoles.includes(req.user.rol)) {
      res.status(403).json({
        success: false,
        message: 'No tienes permisos suficientes para realizar esta acción'
      });
      return;
    }
    
    next();
  };
};
