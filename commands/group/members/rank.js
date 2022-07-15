const { MessageType, Mimetype } = require("@adiwajshing/baileys");

const {
  getRankInAllGroups,
  getCountIndividual,
} = require("../../../db/countMemberDB");

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

  let { name, ranks, count, totalUsers } = await getRankInAllGroups(sender);
  if (!name) {
    reply("❌ ERROR: User NOT FOUND in Database!");
    return;
  }
  let res = await getCountIndividual(sender, from);
  let countCurGroup = res.count;

  sock.sendMessage(
    from,
    {
      text: `User: ${name}\nRank: ${ranks} out of ${totalUsers}\n\n*💬 message count*\nAll PVX group: ${count}\nCurrent group: ${countCurGroup}`,
    },
    { quoted: msg }
  );
};
