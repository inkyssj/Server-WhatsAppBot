const fs = require('fs');

// Baileys
const {
  makeWASocket,
  DisconnectReason,
  useMultiFileAuthState
} = require('baileys');

const P = require('pino');
const QRCode = require('qrcode');

const start = async() => {
  const { state, saveCreds } = await useMultiFileAuthState('./auth');
    
  const sock = makeWASocket({
    auth: state,
    logger: P({ level: 'silent' })
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      const QRWhatsApp = await QRCode.toString(qr, { type: 'terminal' })
      console.log(QRWhatsApp)
    }

    if (connection == 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      console.log('Conexión cerrada. Reconectando:', shouldReconnect)
        
      if (shouldReconnect) {
        start()
      }
    }
    
    if (connection == 'open') {
      console.log('Conectado a WhatsApp')
    }
  });
  
  sock.ev.on('messages.upsert', ({ type, messages }) => {
    if (type == 'notify') {
      for (const message of messages) {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text
        if (text)
          console.log('Mensaje:', text)
      }
    }
  });
};

start();
