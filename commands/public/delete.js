const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  let cmd = ["delete", "d"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { botNumberJid, reply } = msgInfoObj;
  if (
    !msg.message.extendedTextMessage ||
    !(msg.message.extendedTextMessage.contextInfo.participant == botNumberJid)
  ) {
    reply("❌ Tag message of bot to delete.");
    return;
  }

  const options = {
    remoteJid: botNumberJid,
    fromMe: true,
    id: msg.message.extendedTextMessage.contextInfo.stanzaId,
  };
  await sock.sendMessage(from, {
    delete: options,
  });
};
