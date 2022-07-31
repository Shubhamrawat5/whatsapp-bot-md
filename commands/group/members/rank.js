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
    reply(`❌ ERROR: ${sender} NOT FOUND in Database!`);
    return;
  }
  let res = await getCountIndividual(sender, from);
  let countCurGroup = res.count;

  //find rank
  let rankName;
  if (ranks <= 10) {
    rankName = "Prime 🔮";
  } else if (ranks <= 50) {
    rankName = "Diamond 💎";
  } else if (ranks <= 100) {
    rankName = "Platinum 🛡";
  } else if (ranks <= 500) {
    rankName = "Elite 🔰";
  } else if (ranks <= 1000) {
    rankName = "Gold ⭐️ ";
  } else if (ranks <= 1500) {
    rankName = "Silver ⚔️";
  } else {
    rankName = "Bronze ⚱️";
  }

  sock.sendMessage(
    from,
    {
      text: `${name} (#${ranks}/${totalUsers})\nRank: ${rankName}\n\n*💬 message count*\nAll PVX groups: ${count}\nCurrent group  : ${countCurGroup}`,
    },
    { quoted: msg }
  );
};
