const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  let cmd = ["source"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix } = msgInfoObj;
  let text = `*─「 <{PVX}> BOT 」 ─*\n\nhttps://github.com/Shubhamrawat5/whatsapp-bot-md \n\nGive a star if you like or using this. Many new cool helpful commands will be keep on adding.\n\nTutorial: https://youtu.be/2gBzapttokk`;

  sock.sendMessage(from, { text }, { quoted: msg });
};
