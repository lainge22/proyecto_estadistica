import express from 'express';
import cors from 'cors';
import pool from './config/db'; // Importamos el pool
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middlewares/error.middleware'; // <--- IMPORTA EL MIDDLEWARE
import { authenticate } from './middlewares/auth.middleware';
import router from './routes/auth.routes';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Probar conexión a BD al iniciar
pool.getConnection()
  .then(() => console.log('✅ Conectado a MySQL exitosamente'))
  .catch((err) => console.error('❌ Error conectando a la BD:', err));

  
// Rutas
app.use('/api/v1/auth', authRoutes);
app.use(errorHandler);

// Si tu ruta es /api/v1/auth/test-auth, en este archivo DEBE decir:
router.get('/test-auth', authenticate, (req, res) => { });
export default app;