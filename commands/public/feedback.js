const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  return { cmd: "feedback", handler: handler };
};

const handler = async (sock, msg, from, args, prefix) => {
  let text = `✔ Give any Feedback related to PVX\nhttps://forms.gle/WEQ33xzHpYAQvArd6`;

  sock.sendMessage(from, { text }, { quoted: msg });
};
