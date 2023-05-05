const { getCountGroups } = require("../../db/countMemberDB");

module.exports.command = () => {
  let cmd = ["pvxg"];

  return { cmd, handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  const { reply } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  let resultCountGroup = await getCountGroups();
  let countGroupMsg = `*📛 PVX GROUP STATS 📛*\n_From 24 Nov 2021_${readMore}\n`;

  let countGroupMsgTemp = "\n";
  let totalGrpCount = 0;
  for (let group of resultCountGroup) {
    let grpName = group.gname;
    if (!grpName || !grpName.toUpperCase().includes("<{PVX}>")) continue; //not a pvx group
    // grpName = grpName.split(" ")[1];
    grpName = grpName.replace("<{PVX}> ", "");
    totalGrpCount += Number(group.count);
    countGroupMsgTemp += `\n${group.count} - ${grpName}`;
  }
  countGroupMsg += `\n*Total Messages: ${totalGrpCount}*`;
  countGroupMsg += countGroupMsgTemp;
  await reply(countGroupMsg);
};
