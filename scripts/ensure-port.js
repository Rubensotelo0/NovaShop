import net from 'node:net';
import { execFileSync } from 'node:child_process';
import process from 'node:process';

const port = Number(process.argv[2]);

if (!Number.isInteger(port) || port <= 0 || port > 65535) {
  console.error('Uso: node scripts/ensure-port.js <puerto>');
  process.exit(1);
}

function puertoEstaAbierto() {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: '127.0.0.1', port });

    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });
  });
}

function obtenerProcesosWindows() {
  const salida = execFileSync(
    'powershell.exe',
    [
      '-NoProfile',
      '-Command',
      `(Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue).OwningProcess`
    ],
    { encoding: 'utf8' }
  );

  return [...new Set(
    salida
      .split(/\r?\n/)
      .map((linea) => Number(linea.trim()))
      .filter((id) => Number.isInteger(id) && id > 0)
  )];
}

function obtenerProcesosUnix() {
  try {
    const salida = execFileSync('lsof', ['-ti', `tcp:${port}`], { encoding: 'utf8' });
    return [...new Set(
      salida
        .split(/\r?\n/)
        .map((linea) => Number(linea.trim()))
        .filter((id) => Number.isInteger(id) && id > 0)
    )];
  } catch {
    return [];
  }
}

function cerrarProceso(id) {
  if (process.platform === 'win32') {
    execFileSync('taskkill.exe', ['/PID', String(id), '/T', '/F'], { stdio: 'ignore' });
    return;
  }

  process.kill(id, 'SIGTERM');
}

const activo = await puertoEstaAbierto();

if (!activo) {
  console.log(`El puerto ${port} está disponible.`);
  process.exit(0);
}

const procesos = process.platform === 'win32'
  ? obtenerProcesosWindows()
  : obtenerProcesosUnix();

for (const id of procesos) {
  try {
    cerrarProceso(id);
    console.log(`Proceso ${id} detenido para liberar el puerto ${port}.`);
  } catch (error) {
    console.error(`No se pudo detener el proceso ${id}: ${error.message}`);
    process.exit(1);
  }
}

console.log(`El puerto ${port} quedó libre para la nueva instancia.`);
