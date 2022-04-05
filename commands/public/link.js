const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  return { cmd: "link", handler: handler };
};

const handler = async (sock, msg, from, args, prefix) => {
  let text =
    "*─「 🔥 JOIN <{PVX}> FAMILY 🔥 」─*\n\n>> https://pvxcommunity.com <<";

  sock.sendMessage(from, { text }, { quoted: msg });
};

// case "pvxlink":
// case "pvxlinks":
// case "pvx":
// case "link":
