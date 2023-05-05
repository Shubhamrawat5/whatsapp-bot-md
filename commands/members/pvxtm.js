const { getCountTop } = require("../../db/countMemberDB");

module.exports.command = () => {
  let cmd = ["pvxtm", "pvxmt"];

  return { cmd, handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  let { groupName, reply, groupMembers } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  groupMembers = groupMembers.map((member) => member.id);

  let resultCountGroupTop = await getCountTop(10000);

  let countGroupMsgTop = `*${groupName}*\n_MEMBERS RANK_${readMore}\n`;

  resultCountGroupTop.forEach((member, index) => {
    if (groupMembers.includes(member.memberjid))
      countGroupMsgTop += `\n${index + 1}) ${member.name} - ${member.count}`;
  });

  reply(countGroupMsgTop);
};
