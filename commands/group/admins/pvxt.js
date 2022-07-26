const { MessageType, Mimetype } = require("@adiwajshing/baileys");

const { getCountTop } = require("../../../db/countMemberDB");

module.exports.command = () => {
  let cmd = ["pvxt"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { groupName, groupMembers, reply } = msgInfoObj;

  let noOfResult = 20;
  //get number from args if available
  if (args.length) {
    let no = Number(args[0]);
    //if number is given then
    if (no && no > 0 && no <= 250) {
      noOfResult = no;
    }
  }
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  let resultCountGroupTop = await getCountTop(noOfResult);
  let countGroupMsgTop = `*📛 PVX TOP ${noOfResult} MEMBERS 📛*\n_From 24 Nov 2021_${readMore}\n`;

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
