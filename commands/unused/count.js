const { getCountIndividual } = require("../../db/countMemberDB");

module.exports.command = () => {
  let cmd = ["count"];

  return { cmd, handler };
};

const handler = async (bot, msg, from, msgInfoObj) => {
  let { sender, reply, args } = msgInfoObj;
  await reply("Use !rank command");
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

  let { name, count } = await getCountIndividual(sender, from);
  if (name == "") {
    name = sender;
    count = 0;
  }

  await reply(
    `User: ${name}\nTotal messages: ${count}\n\n_from 24 NOV_ in this group!_`
  );
};
