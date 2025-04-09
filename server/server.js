// servidor_udp.js
// Isaias Salgado Castillo
// Job Moore Garay
// IDS 8vo TV Sistemas Distribuidos DASC UABCS

const dgram = require('dgram');
const os = require('os');

const server = dgram.createSocket('udp4');

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (let iface in interfaces) {
        for (let i of interfaces[iface]) {
            if (i.family === 'IPv4' && !i.internal) return i.address;
        }
    }
    return 'localhost';
}

server.on('listening', () => {
    const address = server.address();
    console.log(`Servidor UDP escuchando en IP: ${getLocalIP()} puerto: ${address.port}`);
});

server.on('message', (msg, rinfo) => {
    console.log(`Mensaje de ${rinfo.address}:${rinfo.port} -> ${msg}`);
    
    const respuesta = `Servidor recibió tu mensaje: ${msg}`;
    server.send(respuesta, rinfo.port, rinfo.address);
});

server.bind(5051); // Escuchar en el puerto 5050
