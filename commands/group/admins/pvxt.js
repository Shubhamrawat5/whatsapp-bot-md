const { MessageType, Mimetype } = require("@adiwajshing/baileys");

const { getCountTop } = require("../../../db/countMemberDB");

module.exports.command = () => {
  let cmd = ["pvxt"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { groupName, groupMembers, reply } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  let resultCountGroupTop = await getCountTop();
  let countGroupMsgTop = `*📛 PVX TOP MEMBERS 📛*\n_From 24 Nov 2021_${readMore}\n`;

  let countGroupMsgTempTop = "\n";
  let totalGrpCountTop = 0;
  for (let member of resultCountGroupTop) {
    totalGrpCountTop += Number(member.count);
    countGroupMsgTempTop += `\n${member.count} - ${member.name}`;
  }
  countGroupMsgTop += `\n*Total Messages: ${totalGrpCountTop}*`;
  countGroupMsgTop += countGroupMsgTempTop;
  sock.sendMessage(from, { text: countGroupMsgTop }, { quoted: msg });
};
