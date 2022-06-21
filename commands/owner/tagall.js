const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  let cmd = ["tagall"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { sender, prefix, groupName, groupMembers, botNumberJid, myNumber } =
    msgInfoObj;
  try {
    if (
      groupName.toUpperCase().includes("PVX") &&
      ![myNumber + "@s.whatsapp.net", botNumberJid].includes(sender)
    ) {
      sock.sendMessage(
        from,
        { text: `❌ Owner only command for avoiding spam in PVX Groups!` },
        { quoted: msg }
      );
      return;
    }

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

    for (let i of groupMembers) {
      message += "@" + i.id.split("@")[0] + " ";
      jids.push(i.id.replace("c.us", "s.whatsapp.net"));
    }

    sock.sendMessage(from, { text: message, mentions: jids }, { quoted: msg });
  } catch (err) {
    console.log(err);
    sock.sendMessage(from, { text: `❌ Error!` }, { quoted: msg });
  }
};
