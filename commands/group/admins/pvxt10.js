const { MessageType, Mimetype } = require("@adiwajshing/baileys");

const { getCountTop5 } = require("../../../db/countMemberDB");

module.exports.command = () => {
  let cmd = ["pvxt10"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  try {
    let { groupName, groupMembers } = msgInfoObj;
    const more = String.fromCharCode(8206);
    const readMore = more.repeat(4001);
    let resultCountGroupTop5 = await getCountTop5();
    let countGroupMsgTop5 = `*📛 PVX TOP 10 MEMBERS FROM ALL GROUPS 📛*\n_From 24 Nov 2021_${readMore}\n`;

    let countGroupMsgTempTop5 = `\n\n📛 ${resultCountGroupTop5[0].gname}`;
    let count = 0;
    for (let member of resultCountGroupTop5) {
      //TODO: remember last groupname
      if (count == 10) {
        count = 0;
        countGroupMsgTempTop5 += `\n\n📛 *${member.gname}*`;
      }
      countGroupMsgTempTop5 += `\n${member.count} - ${member.name}`;
      ++count;
    }
    countGroupMsgTop5 += countGroupMsgTempTop5;
    sock.sendMessage(from, { text: countGroupMsgTop5 }, { quoted: msg });
  } catch (err) {
    console.log(err);
    sock.sendMessage(
      from,
      { text: "❌ There is some problem!" },
      { quoted: msg }
    );
  }
};
