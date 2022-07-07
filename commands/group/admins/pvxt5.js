const { MessageType, Mimetype } = require("@adiwajshing/baileys");

const { getCountTop5 } = require("../../../db/countMemberDB");

module.exports.command = () => {
  let cmd = ["pvxt5"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { groupName, groupMembers, reply } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  let resultCountGroupTop5 = await getCountTop5();
  let countGroupMsgTop5 = `*📛 PVX TOP 5 MEMBERS FROM ALL GROUPS 📛*\n_From 24 Nov 2021_${readMore}\n`;

  let lastGroupName = resultCountGroupTop5[0].gname;
  let countGroupMsgTempTop5 = `\n\n📛 ${lastGroupName}`;
  for (let member of resultCountGroupTop5) {
    if (member.gname != lastGroupName) {
      lastGroupName = member.gname;
      countGroupMsgTempTop5 += `\n\n📛 *${lastGroupName}*`;
    }
    countGroupMsgTempTop5 += `\n${member.count} - ${member.name}`;
  }

  countGroupMsgTop5 += countGroupMsgTempTop5;
  sock.sendMessage(from, { text: countGroupMsgTop5 }, { quoted: msg });
};
