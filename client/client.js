// cliente_udp.js
const dgram = require('dgram');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const client = dgram.createSocket('udp4');
const SERVER_PORT = 5051;
let saturando = false;
let saturarInterval;
let mensajesPerdidos = 0; // Contador de mensajes perdidos

rl.question('Ingresa tu nombre de usuario: ', (nombreUsuario) => {
    rl.question('Ingresa la IP del servidor: ', (ip) => {

        function enviarMensaje() {
            rl.question('Escribe un mensaje (o "/salir" para terminar, "/saturar" para iniciar saturación): ', (mensaje) => {
                if (mensaje.toLowerCase() === '/salir') {
                    rl.close();
                    client.close();
                    return;
                }

                // Comando para simular saturación
                if (mensaje.toLowerCase() === '/saturar') {
                    if (!saturando) {
                        saturando = true;
                        mensajesPerdidos = 0; // Reiniciar el contador de mensajes perdidos
                        console.log("Saturando... Se enviarán muchos mensajes rápidamente.");
                        // Inicia el envío de mensajes con intervalos
                        saturarInterval = setInterval(() => {
                            const mensajeConNombre = `${nombreUsuario}: Saturación de paquetes`;
                            const buffer = Buffer.from(mensajeConNombre);
                            // Simulamos la pérdida de paquetes aleatoriamente
                            if (Math.random() > 0.2) {  // 80% de probabilidad de que el mensaje se envíe
                                client.send(buffer, SERVER_PORT, ip.trim(), (err) => {
                                    if (err) console.log('Error al enviar:', err.message);
                                });
                            } else {
                                console.log("Mensaje perdido.");
                                mensajesPerdidos++;
                                // Si el número de mensajes perdidos alcanza 10, detener la saturación
                                if (mensajesPerdidos >= 10) {
                                    clearInterval(saturarInterval);
                                    saturando = false;
                                    console.log("Saturación detenida. Se alcanzaron 10 mensajes perdidos.");
                                }
                            }
                        }, 100); // Enviar un mensaje cada 100ms
                    } else {
                        console.log("La saturación ya está activa.");
                    }
                } else if (mensaje.toLowerCase() === '/detener' && saturando) {
                    // Detener la saturación si el cliente lo solicita
                    clearInterval(saturarInterval);
                    saturando = false;
                    console.log("Saturación detenida.");
                } else {
                    // Enviar un mensaje normal si no es '/saturar' ni '/detener'
                    const mensajeConNombre = `${nombreUsuario}: ${mensaje}`;
                    const buffer = Buffer.from(mensajeConNombre);

                    // Enviar el mensaje al servidor
                    client.send(buffer, SERVER_PORT, ip.trim(), (err) => {
                        if (err) console.log('Error al enviar:', err.message);
                    });

                    client.once('message', (respuesta) => {
                        console.log(`Respuesta del servidor: ${respuesta.toString()}`);
                    });
                }
                // Continuar preguntando por nuevos mensajes
                enviarMensaje();
            });
        }

        // Iniciar el proceso de envío de mensajes
        enviarMensaje();
    });
});
