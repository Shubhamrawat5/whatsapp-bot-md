const { MessageType, Mimetype } = require("@adiwajshing/baileys");

const { getRankInAllGroups } = require("../../../db/countMemberDB");

module.exports.command = () => {
  let cmd = ["rank"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { sender, reply } = msgInfoObj;
  if (args[0]) {
    sender = args[0] + "@s.whatsapp.net";
  }
  if (
    msg.message.extendedTextMessage &&
    msg.message.extendedTextMessage.contextInfo &&
    msg.message.extendedTextMessage.contextInfo.participant
  ) {
    sender = msg.message.extendedTextMessage.contextInfo.participant;
  }

  let { name, ranks, count } = await getRankInAllGroups(sender);
  if (name == "") {
    name = sender;
    count = 0;
    ranks = "-";
  }

  sock.sendMessage(
    from,
    {
      text: `${name} rank is _${ranks} with total ${count} messages_ from 24 NOV in all PVX groups!`,
    },
    { quoted: msg }
  );
};
