const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  let cmd = ["dev"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix } = msgInfoObj;
  let text = ` Made By: Imran☠☠\nText me on telegram: https://t.me/Programmer_137 \n Text me on whatsapp: https://wa.me/+254754423664 \n instagram: https://instagram.com/imrany00/ \n Twitter: https://twitter.com/imran_matano `;

  sock.sendMessage(from, { text }, { quoted: msg });
};
