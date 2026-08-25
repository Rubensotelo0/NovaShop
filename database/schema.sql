CREATE DATABASE IF NOT EXISTS novashop;
USE novashop;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  descuento DECIMAL(5, 2) NOT NULL DEFAULT 0,
  imagen VARCHAR(500),
  stock INT NOT NULL DEFAULT 0,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  estado ENUM('pendiente', 'procesando', 'completado', 'cancelado') DEFAULT 'pendiente',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS detalle_pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  descuento DECIMAL(5, 2) NOT NULL DEFAULT 0,
  subtotal DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

INSERT INTO productos
      (id, nombre, descripcion, precio, descuento, imagen, stock)
    VALUES
      (1, 'Laptop Gamer', 'Laptop potente para juegos.', 1200.00, 15, '/src/assets/Laptop.jpg', 10),
      (2, 'Teclado Mecánico', 'Teclado con luces RGB.', 80.50, 10, '/src/assets/Teclado.jpg', 10),
        (3, 'Ratón Inalámbrico', 'Ratón óptico de alta precisión.', 50.00, 0, 'https://tse1.mm.bing.net/th/id/OIP.rYxbOR_gpdZxfkeU8tcDQQHaGZ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', 10),
        (4, 'Monitor 4K', 'Monitor de alta resolución para diseño gráfico.', 400.00, 5, '/src/assets/Monitor.jpg', 10),
        (5, 'Auriculares Gaming', 'Auriculares con sonido envolvente.', 120.00, 20, 'https://m.media-amazon.com/images/I/71noSdO0XjL._AC_SX679_.jpg', 10),
        (6, 'Silla Ergonómica', 'Silla cómoda para largas sesiones de trabajo.', 250.00, 10, 'https://m.media-amazon.com/images/I/51r-4V9wa+L._AC_SX522_.jpg', 10),
        (7, 'Disco Duro Externo', 'Almacenamiento portátil de gran capacidad.', 100.00, 0, 'https://tse3.mm.bing.net/th/id/OIP.UfRg6TExQYx7fSmnvSG6ZwHaE_?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', 10),
        (8, 'Cámara Web HD', 'Cámara para videollamadas y streaming.', 70.00, 5, 'https://m.media-amazon.com/images/I/71eGb1FcyiL._AC_SY300_SX300_QL70_ML2_.jpg', 10),
        (9, 'Micrófono USB', 'Micrófono de alta calidad para grabación.', 90.00, 0, 'https://m.media-amazon.com/images/I/71LlwYACaWL._AC_SY300_SX300_QL70_ML2_.jpg', 10)
    ON DUPLICATE KEY UPDATE
      nombre = VALUES(nombre),
      descripcion = VALUES(descripcion),
      precio = VALUES(precio),
      descuento = VALUES(descuento),
      imagen = VALUES(imagen),
      stock = VALUES(stock);