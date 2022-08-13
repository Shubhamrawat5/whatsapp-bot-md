const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  let cmd = ["dd"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { botNumberJid, reply } = msgInfoObj;

  const options = {
    remoteJid: from,
    fromMe: false,
    id: msg.message.extendedTextMessage.contextInfo.stanzaId,
    participant: msg.message.extendedTextMessage.contextInfo.participant,
  };
  await sock.sendMessage(from, {
    delete: options,
  });
};
