const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const { getCountVideo } = require("../../../db/countVideoDB");

module.exports.command = () => {
  let cmd = ["pvxv"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { reply, groupMembers } = msgInfoObj;

  let pvxmano = "19016677357-1630334490@g.us";
  if (from != pvxmano) {
    sock.sendMessage(
      from,
      { text: "❌ Only Mano Group command!" },
      { quoted: msg }
    );
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

  sock.sendMessage(
    from,
    {
      text: countGroupMsgIndi,
    },
    { quoted: msg }
  );
};
