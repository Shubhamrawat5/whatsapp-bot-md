const { MessageType, Mimetype } = require("@adiwajshing/baileys");

const { getCountGroupMembers } = require("../../../db/countMemberDB");

module.exports.command = () => {
  let cmd = ["pvxm"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  try {
    let { groupName, groupMembers } = msgInfoObj;
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

    console.log(30, countGroupMsgTempIndi);
    groupMembers.forEach((mem) => {
      if (!memWithMsg.has(mem.id)) {
        let username = mem.id.split("@")[0];
        countGroupMsgTempIndi += `\n${0} - ${username}`;
      }
    });

    console.log(38, countGroupMsgTempIndi);
    countGroupMsgIndi += `\n*Total Messages: ${totalGrpCountIndi}*`;
    countGroupMsgIndi += countGroupMsgTempIndi;

    sock.sendMessage(from, { text: countGroupMsgIndi }, { quoted: msg });
  } catch (err) {
    console.log(err);
    sock.sendMessage(
      from,
      { text: "❌ There is some problem!" },
      { quoted: msg }
    );
  }
};
