const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  let cmd = ["source"];

  return { cmd, handler };
};
const handler = async (sock, msg, from, args, prefix) => {
  let text = `*─「 <{PVX}> BOT 」 ─*\n\nhttps://github.com/Shubhamrawat5/whatsapp-bot \n\nGive a star if you like or using this. Many new cool helpful commands will be keep on adding.`;

  sock.sendMessage(from, { text }, { quoted: msg });
};
