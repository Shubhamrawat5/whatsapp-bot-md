const { MessageType, Mimetype } = require("@adiwajshing/baileys");

const { getCountTop10 } = require("../../../db/countMemberDB");

module.exports.command = () => {
  let cmd = ["pvxt10"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { groupName, groupMembers, reply } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  let resultCountGroupTop10 = await getCountTop10();
  let countGroupMsgTop10 = `*📛 PVX TOP 10 MEMBERS FROM ALL GROUPS 📛*\n_From 24 Nov 2021_${readMore}\n`;

  let lastGroupName = resultCountGroupTop10[0].gname;
  let countGroupMsgTempTop10 = `\n\n📛 ${lastGroupName}`;
  for (let member of resultCountGroupTop10) {
    if (member.gname != lastGroupName) {
      lastGroupName = member.gname;
      countGroupMsgTempTop10 += `\n\n📛 *${lastGroupName}*`;
    }
    countGroupMsgTempTop10 += `\n${member.count} - ${member.name}`;
  }
  countGroupMsgTop10 += countGroupMsgTempTop10;
  sock.sendMessage(from, { text: countGroupMsgTop10 }, { quoted: msg });
};
