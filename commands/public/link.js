const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  let cmd = ["link", "links", "pvxlink", "pvxlinks"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix } = msgInfoObj;
  let text =
    "*Bot Imranyy☠*\n\n>> https://instagram.com/imrany00/ <<";

  sock.sendMessage(from, { text }, { quoted: msg, detectLinks: true });
};
