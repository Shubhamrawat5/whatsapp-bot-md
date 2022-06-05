const { MessageType, Mimetype } = require("@adiwajshing/baileys");

const { getCountIndividualAllGroup } = require("../../../db/countMemberDB");

module.exports.command = () => {
  let cmd = ["total"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { sender } = msgInfoObj;
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
    let { name, count } = await getCountIndividualAllGroup(sender);
    if (name == "") {
      name = sender;
      count = 0;
    }

    sock.sendMessage(
      from,
      {
        text: `${name} have _${count} messages from 24 NOV_ in all PVX groups!`,
      },
      { quoted: msg }
    );
  } catch (err) {
    console.log(err);
    sock.sendMessage(
      from,
      { text: "❌ There is some problem!" },
      { quoted: msg }
    );
  }
};
