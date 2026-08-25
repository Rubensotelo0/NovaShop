import cors from 'cors';
import express from 'express';
import 'dotenv/config';
import { pool } from './config/database.js';
import { initializeDatabase } from './config/initializeDatabase.js';

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

app.get('/api/productos', async (_request, response) => {
  try {
    const [productos] = await pool.query(`
      SELECT id, nombre, descripcion, precio, descuento, imagen, stock
      FROM productos
      ORDER BY id
    `);

    response.json(productos.map((producto) => ({
      ...producto,
      id: String(producto.id),
      desc: producto.descripcion,
      precio: Number(producto.precio),
      descuento: Number(producto.descuento || 0)
    })));
  } catch (error) {
    console.error('No se pudieron cargar los productos:', error);
    response.status(500).json({ message: 'No se pudieron cargar los productos' });
  }
});

async function startServer() {
  await initializeDatabase();
  app.listen(port, () => {
    console.log(`NovaShop API escuchando en http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error('No se pudo inicializar la base de datos:', error.message);
  process.exit(1);
});
