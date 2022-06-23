const { MessageType, Mimetype } = require("@adiwajshing/baileys");

const {
  getCountIndividualAllGroupWithName,
} = require("../../../db/countMemberDB");

module.exports.command = () => {
  let cmd = ["totalg"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { sender } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
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
    let resultCountGroup = await getCountIndividualAllGroupWithName(sender);

    let username = resultCountGroup.length
      ? resultCountGroup[0].name
      : sender.split("@")[0];

    let countGroupMsg = `*📛 ${username} PVX STATS 📛*\n_From 24 Nov 2021_${readMore}\n`;
    let countGroupMsgTemp = "\n";
    let totalGrpCount = 0;
    for (let group of resultCountGroup) {
      let grpName = group.gname;
      grpName = grpName.replace("<{PVX}> ", "");
      totalGrpCount += Number(group.count);
      countGroupMsgTemp += `\n${group.count} - ${grpName}`;
    }
    countGroupMsg += `\n*TotaL Messages: ${totalGrpCount}*`;
    countGroupMsg += countGroupMsgTemp;

    sock.sendMessage(
      from,
      {
        text: countGroupMsg,
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
