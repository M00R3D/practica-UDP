// cliente_udp.js
// Isaias Salgado Castillo
// Job Moore Garay
// IDS 8vo TV Sistemas Distribuidos DASC UABCS

const dgram = require('dgram');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const client = dgram.createSocket('udp4');
const SERVER_PORT = 5051;

rl.question('Ingresa tu nombre de usuario: ', (nombreUsuario) => {
    rl.question('Ingresa la IP del servidor: ', (ip) => {
        function enviarMensaje() {
            rl.question('Escribe un mensaje (o "/salir" para terminar): ', (mensaje) => {
                if (mensaje.toLowerCase() === '/salir') {
                    rl.close();
                    client.close();
                    return;
                }

                // Incluir el nombre de usuario en el mensaje
                const mensajeConNombre = `${nombreUsuario}: ${mensaje}`;
                const buffer = Buffer.from(mensajeConNombre);

                // Enviar el mensaje al servidor
                client.send(buffer, SERVER_PORT, ip.trim(), (err) => {
                    if (err) console.log('Error al enviar:', err.message);
                });

                client.once('message', (respuesta) => {
                    console.log(`Respuesta del servidor: ${respuesta.toString()}`);
                    enviarMensaje(); 
                });
            });
        }

        enviarMensaje();
    });
});
