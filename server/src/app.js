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

app.get('/api/productos', async (request, response) => {
  try {
    const termino = request.query.q?.trim() || '';
    const parametros = [];
    let filtroBusqueda = '';

    if (termino) {
      filtroBusqueda = `
        WHERE nombre LIKE ?
      `;
      const terminoLike = `%${termino}%`;
      parametros.push(terminoLike);
    }

    const [productos] = await pool.query(`
      SELECT id, nombre, marca, descripcion, precio, descuento, imagen, stock
      FROM productos
      ${filtroBusqueda}
      ORDER BY id
    `, parametros);

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

async function getOrCreateActiveCart(connection = pool) {
  const [carritos] = await connection.query(`
    SELECT id
    FROM carritos
    WHERE estado = 'activo'
    ORDER BY id
    LIMIT 1
  `);

  if (carritos.length > 0) {
    return carritos[0].id;
  }

  const [result] = await connection.query(`
    INSERT INTO carritos (estado)
    VALUES ('activo')
  `);

  return result.insertId;
}

async function buildCartResponse(connection = pool) {
  const carritoId = await getOrCreateActiveCart(connection);
  const [items] = await connection.query(`
    SELECT
      dc.producto_id,
      dc.cantidad,
      dc.precio_unitario,
      p.nombre,
      p.marca,
      p.descripcion,
      p.precio,
      p.descuento,
      p.imagen,
      p.stock
    FROM detalle_carritos dc
    INNER JOIN productos p ON p.id = dc.producto_id
    WHERE dc.carrito_id = ?
    ORDER BY dc.id
  `, [carritoId]);

  const normalizedItems = items.map((item) => {
    const cantidad = Number(item.cantidad);
    const precioUnitario = Number(item.precio_unitario);
    const precioProducto = Number(item.precio);

    return {
      id: String(item.producto_id),
      cantidad,
      precioUnitario,
      subtotal: cantidad * precioUnitario,
      producto: {
        id: String(item.producto_id),
        nombre: item.nombre,
        marca: item.marca,
        desc: item.descripcion,
        precio: precioProducto,
        descuento: Number(item.descuento || 0),
        imagen: item.imagen,
        stock: Number(item.stock)
      }
    };
  });

  const total = normalizedItems.reduce((sum, item) => sum + item.subtotal, 0);
  const totalArticulos = normalizedItems.reduce((sum, item) => sum + item.cantidad, 0);

  return {
    carritoId,
    items: normalizedItems,
    total,
    totalArticulos
  };
}

async function getProductWithCartQuantity(connection, carritoId, productoId) {
  const [productos] = await connection.query(`
    SELECT
      p.id,
      p.precio,
      p.stock,
      COALESCE(dc.cantidad, 0) AS cantidad_en_carrito
    FROM productos p
    LEFT JOIN detalle_carritos dc
      ON dc.producto_id = p.id
      AND dc.carrito_id = ?
    WHERE p.id = ?
    LIMIT 1
  `, [carritoId, productoId]);

  if (productos.length === 0) {
    return null;
  }

  return {
    id: Number(productos[0].id),
    precio: Number(productos[0].precio),
    stock: Number(productos[0].stock),
    cantidadEnCarrito: Number(productos[0].cantidad_en_carrito)
  };
}

app.get('/api/carrito', async (_request, response) => {
  try {
    const cart = await buildCartResponse();
    response.json(cart);
  } catch (error) {
    console.error('No se pudo cargar el carrito:', error);
    response.status(500).json({ message: 'No se pudo cargar el carrito' });
  }
});

app.post('/api/carrito/items', async (request, response) => {
  const productoId = Number(request.body?.productoId);
  const cantidad = Number(request.body?.cantidad ?? 1);

  if (!Number.isInteger(productoId) || productoId <= 0) {
    return response.status(400).json({ message: 'Producto inválido' });
  }

  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    return response.status(400).json({ message: 'Cantidad inválida' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const carritoId = await getOrCreateActiveCart(connection);
    const producto = await getProductWithCartQuantity(
      connection,
      carritoId,
      productoId
    );

    if (!producto) {
      await connection.rollback();
      return response.status(404).json({ message: 'Producto no encontrado' });
    }

    if (producto.stock <= 0) {
      await connection.rollback();
      return response.status(409).json({ message: 'No hay stock disponible para este producto' });
    }

    const cantidadFinal = producto.cantidadEnCarrito + cantidad;

    if (cantidadFinal > producto.stock) {
      await connection.rollback();
      return response.status(409).json({
        message: `Solo hay ${producto.stock} unidades disponibles`
      });
    }

    await connection.query(`
      INSERT INTO detalle_carritos (carrito_id, producto_id, cantidad, precio_unitario)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        cantidad = cantidad + VALUES(cantidad),
        precio_unitario = VALUES(precio_unitario)
    `, [carritoId, productoId, cantidad, producto.precio]);

    await connection.commit();

    const cart = await buildCartResponse(connection);
    response.status(201).json(cart);
  } catch (error) {
    await connection.rollback();
    console.error('No se pudo agregar el producto al carrito:', error);
    response.status(500).json({ message: 'No se pudo agregar el producto al carrito' });
  } finally {
    connection.release();
  }
});

app.patch('/api/carrito/items/:productoId', async (request, response) => {
  const productoId = Number(request.params.productoId);
  const cantidad = Number(request.body?.cantidad);

  if (!Number.isInteger(productoId) || productoId <= 0) {
    return response.status(400).json({ message: 'Producto inválido' });
  }

  if (!Number.isInteger(cantidad)) {
    return response.status(400).json({ message: 'Cantidad inválida' });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const carritoId = await getOrCreateActiveCart(connection);

    if (cantidad <= 0) {
      await connection.query(`
        DELETE FROM detalle_carritos
        WHERE carrito_id = ? AND producto_id = ?
      `, [carritoId, productoId]);
    } else {
      const producto = await getProductWithCartQuantity(
        connection,
        carritoId,
        productoId
      );

      if (!producto) {
        await connection.rollback();
        return response.status(404).json({ message: 'Producto no encontrado' });
      }

      if (cantidad > producto.stock) {
        await connection.rollback();
        return response.status(409).json({
          message: `Solo hay ${producto.stock} unidades disponibles`
        });
      }

      await connection.query(`
        UPDATE detalle_carritos
        SET cantidad = ?, precio_unitario = ?
        WHERE carrito_id = ? AND producto_id = ?
      `, [cantidad, producto.precio, carritoId, productoId]);
    }

    await connection.commit();

    const cart = await buildCartResponse(connection);
    response.json(cart);
  } catch (error) {
    await connection.rollback();
    console.error('No se pudo actualizar el carrito:', error);
    response.status(500).json({ message: 'No se pudo actualizar el carrito' });
  } finally {
    connection.release();
  }
});

app.delete('/api/carrito/items/:productoId', async (request, response) => {
  const productoId = Number(request.params.productoId);

  if (!Number.isInteger(productoId) || productoId <= 0) {
    return response.status(400).json({ message: 'Producto inválido' });
  }

  try {
    const carritoId = await getOrCreateActiveCart();
    await pool.query(`
      DELETE FROM detalle_carritos
      WHERE carrito_id = ? AND producto_id = ?
    `, [carritoId, productoId]);

    const cart = await buildCartResponse();
    response.json(cart);
  } catch (error) {
    console.error('No se pudo quitar el producto del carrito:', error);
    response.status(500).json({ message: 'No se pudo quitar el producto del carrito' });
  }
});

app.delete('/api/carrito', async (_request, response) => {
  try {
    const carritoId = await getOrCreateActiveCart();
    await pool.query(`
      DELETE FROM detalle_carritos
      WHERE carrito_id = ?
    `, [carritoId]);

    const cart = await buildCartResponse();
    response.json(cart);
  } catch (error) {
    console.error('No se pudo vaciar el carrito:', error);
    response.status(500).json({ message: 'No se pudo vaciar el carrito' });
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
