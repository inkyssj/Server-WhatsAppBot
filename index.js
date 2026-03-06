const fs = require('fs');

// Baileys
const { makeWASocket, DisconnectReason } = require('baileys');
const P = require('pino');
const QRCode = require('qrcode');

const start = async() => {
  const sock = makeWASocket({
    auth: any,
    logger: P()
  });
  
  sock.ev.on('connection.update', async({ connection, lastDisconnect, qr }) => {
    if (qr) {
      let QRWhatsApp = await QRCode.toString(qr, { type: 'terminal' })
        console.log(QRWhatsApp)
    }
  });
  
  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection == 'close' && (lastDisconnect?.error as Boom)?.output?.statusCode == DisconnectReason.restartRequired) {
      start()
    }
  });

  sock.ev.on('messages.upsert', ({type, messages}) => {
    if (type == 'notify') {
      for (const message of messages) {
        // messages is an array, do not just handle the first message, you will miss messages
      }
    } else { // old already seen / handled messages
      // handle them however you want to
    }
  });
};

start()
