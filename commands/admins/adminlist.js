const { getUsernames } = require("../../db/countMemberDB");

module.exports.command = () => {
  let cmd = ["adminlist"];

  return { cmd, handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  let { reply } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  let chats = await bot.groupFetchAllParticipating();
  // console.log(chats);
  // !v.announce &&
  let groups = Object.values(chats)
    .filter((v) => v.id.endsWith("g.us") && v.subject.startsWith("<{PVX}>"))
    .map((v) => {
      return { subject: v.subject, id: v.id, participants: v.participants };
    });
  // console.log(groups);

  let pvxMsg = `*📛 PVX ADMIN LIST 📛*${readMore}`;

  for (let group of groups) {
    let grpName = group.subject;
    grpName = grpName.replace("<{PVX}> ", "");
    pvxMsg += `\n\n📛 *${grpName}*`;
    const memberjidArray = [];
    group.participants.forEach(async (mem) => {
      if (mem.admin) {
        memberjidArray.push(mem.id);
      }
    });
    const res = await getUsernames(memberjidArray);
    if (res.length === memberjidArray.length) {
      res.forEach((mem, index) => {
        pvxMsg += `\n${index + 1}) ${mem.name}`;
      });
    } else {
      memberjidArray.forEach((mem, index) => {
        pvxMsg += `\n${index + 1}) ${mem.id}`;
      });
    }
  }

  await reply(pvxMsg);
};
