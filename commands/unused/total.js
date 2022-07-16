const { MessageType, Mimetype } = require("@adiwajshing/baileys");

const { getCountIndividualAllGroup } = require("../../db/countMemberDB");

module.exports.command = () => {
  let cmd = ["total"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { sender, reply } = msgInfoObj;
  reply("Use !rank command");
  return;

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

  let { name, count } = await getCountIndividualAllGroup(sender);
  if (name == "") {
    name = sender;
    count = 0;
  }

  sock.sendMessage(
    from,
    {
      text: `User:${name}\nTotal messages: _${count}\n\n_from 24 NOV_ in all PVX groups!_`,
    },
    { quoted: msg }
  );
};
