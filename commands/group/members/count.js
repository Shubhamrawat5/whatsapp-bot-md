const { MessageType, Mimetype } = require("@adiwajshing/baileys");

const { getCountIndividual } = require("../../../db/countMemberDB");

module.exports.command = () => {
  let cmd = ["count"];

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

  try {
    let { name, count } = await getCountIndividual(sender, from);
    if (name == "") {
      name = sender;
      count = 0;
    }

    sock.sendMessage(
      from,
      { text: `${name} have _${count} messages from 24 NOV_ in this group!` },
      { quoted: msg }
    );
  } catch (err) {
    console.log(err);
    reply(err.toString());
  }
};
