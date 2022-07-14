const { MessageType, Mimetype } = require("@adiwajshing/baileys");

const { getCountGroupMembers } = require("../../../db/countMemberDB");

module.exports.command = () => {
  let cmd = ["zero"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { groupName, groupMembers, reply } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);
  let resultCountGroupIndi = await getCountGroupMembers(from);

  let memWithMsg = new Set();
  for (let member of resultCountGroupIndi) {
    memWithMsg.add(member.memberjid);
  }

  let zeroMsg = `${groupName}\nMembers with 0 message from 24 NOV:${readMore}\n`;

  groupMembers.forEach((mem) => {
    if (!memWithMsg.has(mem.id)) {
      zeroMsg += `\n${mem.id.split("@")[0]}`;
    }
  });

  sock.sendMessage(from, { text: zeroMsg }, { quoted: msg });
};
