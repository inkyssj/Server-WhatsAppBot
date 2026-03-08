const fs = require('fs');

const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} = require('baileys');

const P = require('pino');
const QRCode = require('qrcode');

const start = async () => {

  const { state, saveCreds } = await useMultiFileAuthState('./auth');

  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: P({ level: 'silent' }),
    browser: ['Ubuntu', 'Chrome', '120.0.0']
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async({ connection, lastDisconnect, qr }) => {
    if (qr) {
      let qrTerminal = await QRCode.toString(qr, { type: 'terminal', small: true, margin: 1 })
      console.log(qrTerminal)
    }

    if (connection == 'close') {
      let statusCode = lastDisconnect?.error?.output?.statusCode
      let shouldReconnect = statusCode !== DisconnectReason.loggedOut

      console.log('Conexión cerrada:', statusCode)
      console.log('Reconectando:', shouldReconnect)

      if (shouldReconnect) {
        setTimeout(start, 5000)
      }
    }

    if (connection == 'open') console.log('Conectado a WhatsApp')
  });

  sock.ev.on('messages.upsert', ({ type, messages }) => {
    if (type == 'notify') console.log(messages[0])
  });
};

start();
