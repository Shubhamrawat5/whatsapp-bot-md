const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  let cmd = ["alive", "a"];

  return { cmd, handler };
};

const handler = async (bot, msg, from, args, msgInfoObj) => {
  let { prefix } = msgInfoObj;
  let text = `*─「 <{PVX}> BOT 」 ─*\n\nYES! BOT IS ALIVE !!!`;

  bot.sendMessage(from, { text }, { quoted: msg });
};
