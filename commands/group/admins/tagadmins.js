const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  let cmd = ["tagadmins", "ta"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { groupAdmins, reply } = msgInfoObj;
  let jids = [];
  let message = "ADMINS: ";
  if (
    msg.message.extendedTextMessage &&
    msg.message.extendedTextMessage.contextInfo.quotedMessage.conversation
  ) {
    message +=
      msg.message.extendedTextMessage.contextInfo.quotedMessage.conversation +
      "\n\n";
  } else {
    message += args.length ? args.join(" ") + "\n\n" : "";
  }

  for (let admin of groupAdmins) {
    message += "@" + admin.split("@")[0] + " ";
    jids.push(admin.replace("c.us", "s.whatsapp.net"));
  }

  sock.sendMessage(from, { text: message, mentions: jids }, { quoted: msg });
};
