exports.smsg = (sock, messages) => {
  message = messages[0]
  if (message.key.remoteJid == 'status@broadcast') return

  console.log(message)
}
