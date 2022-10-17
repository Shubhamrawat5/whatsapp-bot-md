const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  let cmd = ["alive", "a"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix } = msgInfoObj;
  let text = `Hello I am Aliya👸\nYES! I AM ALIVE !!!`;

  sock.sendMessage(from, { text }, { quoted: msg });
};
