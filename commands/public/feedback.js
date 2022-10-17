const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  let cmd = ["feedback"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix } = msgInfoObj;
  let text = `✔ Give any Feedback related to *Bot Imranyy☠*\nmailto:imranmat254@gmail.com`;

  sock.sendMessage(from, { text }, { quoted: msg });
};
