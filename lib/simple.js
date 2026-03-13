module.exports = (sock, messages) => {
  let message = messages[0]

  if (message.key.remoteJid == 'status@broadcast') return
  console.log(message)

  if (message.key) {
    m.id = message.key.id
  }

  m.sendMessage = async(id) => await sock.sendMessage()
}
