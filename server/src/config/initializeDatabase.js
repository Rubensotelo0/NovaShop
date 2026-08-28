import mysql from 'mysql2/promise';
import { pool } from './database.js';

const databaseName = process.env.DB_NAME;

const categoriasIniciales = [
  { id: 1, nombre: 'Laptops', slug: 'laptop' },
  { id: 2, nombre: 'Teclados', slug: 'teclado' },
  { id: 3, nombre: 'Ratones', slug: 'raton' },
  { id: 4, nombre: 'Monitores', slug: 'monitores' },
  { id: 5, nombre: 'Auriculares', slug: 'auriculares' },
  { id: 6, nombre: 'Sillas', slug: 'sillas' },
  { id: 7, nombre: 'Almacenamiento', slug: 'almacenamiento' },
  { id: 8, nombre: 'Cámaras', slug: 'camaras' },
  { id: 9, nombre: 'Micrófonos', slug: 'microfonos' }
];

const productosIniciales = [
  { id: 1, nombre: 'Laptop Gamer', marca: 'MSI', categoriaId: 1, descripcion: 'Laptop potente para juegos.', precio: 1200.00, descuento: 15, imagen: '/src/assets/Laptop.jpg', stock: 10 },
  { id: 2, nombre: 'Teclado Mecánico', marca: 'Redragon', categoriaId: 2, descripcion: 'Teclado con luces RGB.', precio: 80.50, descuento: 10, imagen: '/src/assets/Teclado.jpg', stock: 10 },
  { id: 3, nombre: 'Ratón Inalámbrico', marca: 'Logitech', categoriaId: 3, descripcion: 'Ratón óptico de alta precisión.', precio: 50.00, descuento: 0, imagen: 'https://tse1.mm.bing.net/th/id/OIP.rYxbOR_gpdZxfkeU8tcDQQHaGZ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', stock: 10 },
  { id: 4, nombre: 'Monitor 4K', marca: 'LG', categoriaId: 4, descripcion: 'Monitor de alta resolución para diseño gráfico.', precio: 400.00, descuento: 5, imagen: '/src/assets/Monitor.jpg', stock: 10 },
  { id: 5, nombre: 'Auriculares Gaming', marca: 'HyperX', categoriaId: 5, descripcion: 'Auriculares con sonido envolvente.', precio: 120.00, descuento: 20, imagen: 'https://m.media-amazon.com/images/I/71noSdO0XjL._AC_SX679_.jpg', stock: 10 },
  { id: 6, nombre: 'Silla Ergonómica', marca: 'Corsair', categoriaId: 6, descripcion: 'Silla cómoda para largas sesiones de trabajo.', precio: 250.00, descuento: 10, imagen: 'https://m.media-amazon.com/images/I/51r-4V9wa+L._AC_SX522_.jpg', stock: 10 },
  { id: 7, nombre: 'Disco Duro Externo', marca: 'Seagate', categoriaId: 7, descripcion: 'Almacenamiento portátil de gran capacidad.', precio: 100.00, descuento: 0, imagen: 'https://tse3.mm.bing.net/th/id/OIP.UfRg6TExQYx7fSmnvSG6ZwHaE_?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', stock: 10 },
  { id: 8, nombre: 'Cámara Web HD', marca: 'Logitech', categoriaId: 8, descripcion: 'Cámara para videollamadas y streaming.', precio: 70.00, descuento: 5, imagen: 'https://m.media-amazon.com/images/I/71eGb1FcyiL._AC_SY300_SX300_QL70_ML2_.jpg', stock: 10 },
  { id: 9, nombre: 'Micrófono USB', marca: 'Blue', categoriaId: 9, descripcion: 'Micrófono de alta calidad para grabación.', precio: 90.00, descuento: 0, imagen: 'https://m.media-amazon.com/images/I/71LlwYACaWL._AC_SY300_SX300_QL70_ML2_.jpg', stock: 10 }
];

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
  } finally {
    await connection.end();
  }
}

async function createTables() {
  const tableDefinitions = [
    `CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS categorias (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      slug VARCHAR(100) NOT NULL UNIQUE,
      creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS productos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      marca VARCHAR(100) NOT NULL DEFAULT 'NovaTech',
      categoria_id INT,
      descripcion TEXT,
      precio DECIMAL(10, 2) NOT NULL,
      descuento DECIMAL(5, 2) NOT NULL DEFAULT 0,
      imagen VARCHAR(500),
      stock INT NOT NULL DEFAULT 0,
      creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    )`,
    `CREATE TABLE IF NOT EXISTS carritos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      estado ENUM('activo', 'convertido', 'abandonado') NOT NULL DEFAULT 'activo',
      creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS detalle_carritos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      carrito_id INT NOT NULL,
      producto_id INT NOT NULL,
      cantidad INT NOT NULL,
      precio_unitario DECIMAL(10, 2) NOT NULL,
      creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY carrito_producto_unico (carrito_id, producto_id),
      FOREIGN KEY (carrito_id) REFERENCES carritos(id) ON DELETE CASCADE,
      FOREIGN KEY (producto_id) REFERENCES productos(id)
    )`,
    `CREATE TABLE IF NOT EXISTS pedidos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT NOT NULL,
      total DECIMAL(10, 2) NOT NULL,
      estado ENUM('pendiente', 'procesando', 'completado', 'cancelado') DEFAULT 'pendiente',
      creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )`,
    `CREATE TABLE IF NOT EXISTS detalle_pedidos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      pedido_id INT NOT NULL,
      producto_id INT NOT NULL,
      cantidad INT NOT NULL,
      precio_unitario DECIMAL(10, 2) NOT NULL,
      descuento DECIMAL(5, 2) NOT NULL DEFAULT 0,
      subtotal DECIMAL(10, 2) NOT NULL,
      FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
      FOREIGN KEY (producto_id) REFERENCES productos(id)
    )`
  ];

  for (const tableDefinition of tableDefinitions) {
    await pool.query(tableDefinition);
  }

  try {
    await pool.query(`
      ALTER TABLE productos
      ADD COLUMN descuento DECIMAL(5, 2) NOT NULL DEFAULT 0
    `);
  } catch (error) {
    if (error.code !== 'ER_DUP_FIELDNAME') {
      throw error;
    }
  }

  try {
    await pool.query(`
      ALTER TABLE productos
      ADD COLUMN marca VARCHAR(100) NOT NULL DEFAULT 'NovaTech'
    `);
  } catch (error) {
    if (error.code !== 'ER_DUP_FIELDNAME') {
      throw error;
    }
  }

  try {
    await pool.query(`
      ALTER TABLE productos
      ADD COLUMN categoria_id INT
    `);
  } catch (error) {
    if (error.code !== 'ER_DUP_FIELDNAME') {
      throw error;
    }
  }

  try {
    await pool.query(`
      ALTER TABLE productos
      ADD CONSTRAINT fk_productos_categoria
      FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    `);
  } catch (error) {
    if (!['ER_DUP_KEYNAME', 'ER_FK_DUP_NAME', 'ER_CANT_CREATE_TABLE'].includes(error.code)) {
      throw error;
    }
  }

  await sincronizarCategorias();
  await sincronizarProductos();
}

async function sincronizarCategorias() {
  for (const categoria of categoriasIniciales) {
    await pool.query(`
      INSERT INTO categorias
        (id, nombre, slug)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        nombre = VALUES(nombre),
        slug = VALUES(slug)
    `, [
      categoria.id,
      categoria.nombre,
      categoria.slug
    ]);
  }
}

async function sincronizarProductos() {
  const idsIniciales = productosIniciales.map((producto) => producto.id);
  const conexion = await pool.getConnection();

  try {
    await conexion.beginTransaction();

    for (const producto of productosIniciales) {
      await conexion.query(`
        INSERT INTO productos
          (id, nombre, marca, categoria_id, descripcion, precio, descuento, imagen, stock)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          nombre = VALUES(nombre),
          marca = VALUES(marca),
          categoria_id = VALUES(categoria_id),
          descripcion = VALUES(descripcion),
          precio = VALUES(precio),
          descuento = VALUES(descuento),
          imagen = VALUES(imagen),
          stock = VALUES(stock)
      `, [
        producto.id,
        producto.nombre,
        producto.marca,
        producto.categoriaId,
        producto.descripcion,
        producto.precio,
        producto.descuento,
        producto.imagen,
        producto.stock
      ]);
    }

    const placeholders = idsIniciales.map(() => '?').join(', ');
    const [productosExtra] = await conexion.query(
      `SELECT id, nombre FROM productos WHERE id NOT IN (${placeholders})`,
      idsIniciales
    );

    for (const producto of productosExtra) {
      await conexion.query('DELETE FROM productos WHERE id = ?', [producto.id]);
    }

    await conexion.commit();

    if (productosExtra.length > 0) {
      console.log(`Productos eliminados de MySQL: ${productosExtra.map(({ id }) => id).join(', ')}`);
    }
  } catch (error) {
    await conexion.rollback();

    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      throw new Error('No se puede eliminar un producto extra porque tiene ventas registradas en detalle_pedidos');
    }

    throw error;
  } finally {
    conexion.release();
  }
}

export async function initializeDatabase() {
  await createDatabase();
  await createTables();
  console.log(`Base de datos ${databaseName} lista`);
}
