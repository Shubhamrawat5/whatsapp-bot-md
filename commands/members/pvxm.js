const { getCountGroupMembers } = require("../../db/countMemberDB");

module.exports.command = () => {
  let cmd = ["pvxm"];

  return { cmd, handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  let { groupName, groupMembers, reply, from } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  let resultCountGroupIndi = await getCountGroupMembers(from);

  let memWithMsg = new Set();
  for (let member of resultCountGroupIndi) {
    memWithMsg.add(member.memberjid);
  }

  let countGroupMsgIndi = `*${groupName}*\n_From 24 Nov 2021_${readMore}\n`;

  let countGroupMsgTempIndi = "\n";
  let totalGrpCountIndi = 0;
  for (let member of resultCountGroupIndi) {
    totalGrpCountIndi += member.count;
    countGroupMsgTempIndi += `\n${member.count} - ${member.name}`;
  }

  groupMembers.forEach((mem) => {
    if (!memWithMsg.has(mem.id)) {
      let username = mem.id.split("@")[0];
      countGroupMsgTempIndi += `\n${0} - ${username}`;
    }
  });

  countGroupMsgIndi += `\n*Total Messages: ${totalGrpCountIndi}*`;
  countGroupMsgIndi += countGroupMsgTempIndi;

  await reply(countGroupMsgIndi);
};
