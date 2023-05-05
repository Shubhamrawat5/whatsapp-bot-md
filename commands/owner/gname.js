const { setGroupName } = require("../../db/groupNameDB");

module.exports.command = () => {
  let cmd = ["gname"];

  return { cmd, handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  const { reply } = msgInfoObj;
  let chats = await bot.groupFetchAllParticipating();
  let groups = Object.values(chats)
    .filter((v) => v.id.endsWith("g.us") && v.subject.startsWith("<{PVX}>"))
    .map((v) => {
      return { name: v.subject, id: v.id };
    });

  // console.log(groups);
  for (let group of groups) {
    await setGroupName(group.id, group.name);
  }

  await reply(`✔ Group name data inserted!`);
};
