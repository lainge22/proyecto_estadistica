import { Router } from 'express';
import { AuthController } from '../controller/auth.controller'; // <--- SIN LA 'S' AL FINAL
import { authenticate } from '../middlewares/auth.middleware';   // <--- SIN LA 'S'
import { authorizeRoles } from '../middlewares/rbac.middleware'; // <--- SIN LA 'S'

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.get('/perfil', authenticate, (req, res) => {
  res.json({ message: 'Bienvenido al perfil', user: req.user });
});
export default router;