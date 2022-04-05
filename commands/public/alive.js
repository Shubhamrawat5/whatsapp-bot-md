const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  return { cmd: "alive", handler: handler };
};

const handler = async (sock, msg, from, args, prefix) => {
  let text = `*─「 <{PVX}> BOT 」 ─*\n\nYES! BOT IS ALIVE !!!`;

  sock.sendMessage(from, { text }, { quoted: msg });
};
