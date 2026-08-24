import mysql from 'mysql2/promise';
import { pool } from './database.js';

const databaseName = process.env.DB_NAME;

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
    `CREATE TABLE IF NOT EXISTS productos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(150) NOT NULL,
      descripcion TEXT,
      precio DECIMAL(10, 2) NOT NULL,
      imagen VARCHAR(500),
      stock INT NOT NULL DEFAULT 0,
      creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS pedidos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT NOT NULL,
      total DECIMAL(10, 2) NOT NULL,
      estado ENUM('pendiente', 'procesando', 'completado', 'cancelado') DEFAULT 'pendiente',
      creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )`
  ];

  for (const tableDefinition of tableDefinitions) {
    await pool.query(tableDefinition);
  }
}

export async function initializeDatabase() {
  await createDatabase();
  await createTables();
  console.log(`Base de datos ${databaseName} lista`);
}