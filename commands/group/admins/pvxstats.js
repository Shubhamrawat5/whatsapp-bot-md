const { MessageType, Mimetype } = require("@adiwajshing/baileys");

const { getCountGroupMembers } = require("../../../db/countMemberDB");

module.exports.command = () => {
  let cmd = ["pvxstats"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { groupName, groupMembers, reply } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  let chats = await sock.groupFetchAllParticipating();
  // console.log(chats);
  // !v.announce &&
  let groups = Object.values(chats)
    .filter((v) => v.id.endsWith("g.us") && v.subject.startsWith("<{PVX}>"))
    .map((v) => {
      return { subject: v.subject, id: v.id, participants: v.participants };
    });
  // console.log(groups);

  let pvxMsg = `*📛 PVX STATS 📛*${readMore}`;
  let totalMem = 0;
  let uniqueMem = new Set();
  let temppvxMsg = "";
  let temppvxList = [];
  for (let group of groups) {
    // const mdpvx = await sock.groupMetadata(group.id);
    // console.log(mdpvx);
    // totalMem += mdpvx.participants.length;
    totalMem += group.participants.length;
    temppvxList.push({
      subject: group.subject,
      count: group.participants.length,
    });

    for (let participant of group.participants) {
      uniqueMem.add(participant.id);
    }
  }
  temppvxList = temppvxList.sort((x, y) => y.count - x.count); //sort

  temppvxList.forEach((grp) => {
    temppvxMsg += `\n\n*${grp.subject}*\nMembers: ${grp.count}`;
  });

  pvxMsg += `\nTotal Groups: ${groups.length}\nTotal Members: ${totalMem}\nUnique Members: ${uniqueMem.size}`;
  pvxMsg += temppvxMsg;

  sock.sendMessage(from, { text: pvxMsg }, { quoted: msg });
};
