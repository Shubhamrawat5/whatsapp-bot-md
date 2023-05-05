const { pvxgroups } = require("../../constants/constants");
const { getCountVideo } = require("../../db/countVideoDB");

module.exports.command = () => {
  let cmd = ["pvxv"];

  return { cmd, handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  let { groupMembers, reply, from } = msgInfoObj;

  let { pvxmano } = pvxgroups;
  if (from != pvxmano) {
    await reply("❌ Only Mano Group command!");
    return;
  }
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);

  let resultCountGroupIndi = await getCountVideo(pvxmano);
  let countGroupMsgIndi = `*📛 MANO VIDEO COUNT*\n_From 6 JUNE 2022_${readMore}\n`;
  let memWithMsg = new Set();
  for (let member of resultCountGroupIndi) {
    memWithMsg.add(member.memberjid);
  }

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
