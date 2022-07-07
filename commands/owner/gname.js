const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const { setGroupName } = require("../../db/groupNameDB");

module.exports.command = () => {
  let cmd = ["gname"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix, reply } = msgInfoObj;
  let text = `*─「 <{PVX}> BOT 」 ─*\n\nYES! BOT IS ALIVE !!!`;
  let chats = await sock.groupFetchAllParticipating();
  let groups = Object.values(chats)
    .filter((v) => v.id.endsWith("g.us") && v.subject.startsWith("<{PVX}>"))
    .map((v) => {
      return { name: v.subject, id: v.id };
    });

  // console.log(groups);
  for (let group of groups) {
    await setGroupName(group.id, group.name);
  }
  sock.sendMessage(
    from,
    { text: `✔ Group name data inserted!` },
    { quoted: msg }
  );
};
