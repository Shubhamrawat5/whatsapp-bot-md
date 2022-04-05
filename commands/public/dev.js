const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  return { cmd: "dev", handler: handler };
};

const handler = async (sock, msg, from, args, prefix) => {
  let text = `*─「 <{PVX}> BOT 」 ─*\n\n_Message https://t.me/KryptonPVX in telegram to report any bug or to give new ideas/features for this bot!_ `;

  sock.sendMessage(from, { text }, { quoted: msg });
};
