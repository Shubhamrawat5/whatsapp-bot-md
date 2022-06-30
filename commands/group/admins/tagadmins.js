const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  let cmd = ["tagadmins", "ta"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { groupAdmins, reply } = msgInfoObj;
  try {
    let jids = [];
    let message = "ALL: ";
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

    for (let i of groupAdmins) {
      message += "@" + i.id.split("@")[0] + " ";
      jids.push(i.id.replace("c.us", "s.whatsapp.net"));
    }

    sock.sendMessage(from, { text: message, mentions: jids }, { quoted: msg });
  } catch (err) {
    console.log(err);
    reply(`❌ Error!`);
  }
};
