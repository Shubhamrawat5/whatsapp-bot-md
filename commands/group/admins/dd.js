const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  let cmd = ["dd"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { botNumberJid, reply } = msgInfoObj;

  if (!msg.message.extendedTextMessage) {
    reply("❌ Tag message to delete.");
    return;
  }

  let fromBot = false;
  if (msg.message.extendedTextMessage.contextInfo.participant == botNumberJid) {
    fromBot = true;
  }

  const options = {
    remoteJid: from,
    fromMe: fromBot,
    id: msg.message.extendedTextMessage.contextInfo.stanzaId,
    participant: msg.message.extendedTextMessage.contextInfo.participant,
  };
  await sock.sendMessage(from, {
    delete: options,
  });
};
