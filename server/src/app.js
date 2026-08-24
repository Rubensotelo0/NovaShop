import cors from 'cors';
import express from 'express';
import 'dotenv/config';
import { pool } from './config/database.js';

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

app.get('/api/status', (_request, response) => {
  response.json({ ok: true, message: 'NovaShop API activa' });
});

app.get('/api/db-status', async (_request, response) => {
  try {
    await pool.query('SELECT 1');
    response.json({ ok: true, message: 'Conexión a MySQL activa' });
  } catch (_error) {
    response.status(500).json({ ok: false, message: 'No se pudo conectar a MySQL' });
  }
});

app.listen(port, () => {
  console.log(`NovaShop API escuchando en http://localhost:${port}`);
});
