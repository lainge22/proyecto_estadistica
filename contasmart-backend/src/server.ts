import express from 'express';
import cors from 'cors';
import pool from './config/db'; // Importamos el pool
import authRoutes from './routes/auth.routes';
import app from './app'; // O donde tengas la configuración de express

// const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// Probar conexión a BD al iniciar
pool.getConnection()
  .then(() => console.log('✅ Conectado a MySQL exitosamente'))
  .catch((err) => console.error('❌ Error conectando a la BD:', err));

// Rutas
app.use('/api/v1/auth', authRoutes);

export default app;