const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  let cmd = ["rt", "randomtag"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix, groupMembers, reply } = msgInfoObj;
  let jids = [];
  let message = "Hey ";
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

  let i = groupMembers[Math.floor(Math.random() * groupMembers.length)];
  message += "@" + i.id.split("@")[0] + " ";
  jids.push(i.id.replace("c.us", "s.whatsapp.net"));

  sock.sendMessage(from, { text: message, mentions: jids }, { quoted: msg });
};
