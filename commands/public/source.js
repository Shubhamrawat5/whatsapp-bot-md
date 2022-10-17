const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  let cmd = ["source"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix } = msgInfoObj;
  let text = `*Bot Imrany☠* \n Please follow me on:\n instagram :https://instagram.com/imrany00\nTwitter: https://twitter.com/imran_matano`;

  sock.sendMessage(from, { text }, { quoted: msg });
};
