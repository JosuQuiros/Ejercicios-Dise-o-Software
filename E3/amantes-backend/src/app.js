import express from 'express';
import cors from 'cors';
import amanteRoutes from './routes/amante.routes.js';

export function createApp() {
  const app = express();
  app.use(cors({ origin: true }));
  app.use(express.json());
  app.use(amanteRoutes);
  app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
  });
  return app;
}
