// server/server.js
// Isaias Salgado Castillo
// Job Moore Garay
// IDS 8vo TV Sistemas Distribuidos DASC UABCS

const dgram = require('dgram');
const os = require('os');

const server = dgram.createSocket('udp4');

const clientesConectados = {}; // Para rastrear a los clientes y su tiempo de último mensaje

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    let preferida = null;

    for (let name in interfaces) {
        for (let i of interfaces[name]) {
            if (i.family === 'IPv4' && !i.internal) {
                // Evitar VirtualBox y similares
                if (!name.toLowerCase().includes('virtual') &&
                    !name.toLowerCase().includes('loopback') &&
                    !name.toLowerCase().includes('hamachi') &&
                    !name.toLowerCase().includes('vmware')) {

                    // Si tiene una IP tipo 192.168.x.x, es muy probablemente la correcta
                    if (i.address.startsWith('192.168.')) {
                        return i.address;
                    }

                    // Si aún no hemos guardado ninguna otra
                    if (!preferida) {
                        preferida = i.address;
                    }
                }
            }
        }
    }

    return preferida || 'localhost';
}

server.on('listening', () => {
    const address = server.address();
    console.log(`Servidor UDP escuchando en IP: ${getLocalIP()} puerto: ${address.port}`);
});

server.on('message', (msg, rinfo) => {
    const cliente = `${rinfo.address}:${rinfo.port}`;
    
    // Si es la primera vez que recibimos un mensaje de este cliente, imprimir que se conectó
    if (!clientesConectados[cliente]) {
        console.log(`Cliente conectado: ${cliente}`);
        clientesConectados[cliente] = Date.now(); // Registrar el tiempo de la última conexión
    }

    // Actualizar el tiempo de última actividad del cliente
    clientesConectados[cliente] = Date.now();

    console.log(`Mensaje de ${cliente} -> ${msg}`);
    
    const respuesta = `Servidor recibió tu mensaje: ${msg}`;
    server.send(respuesta, rinfo.port, rinfo.address);
});

server.bind(5051); // Escuchar en el puerto 5051
