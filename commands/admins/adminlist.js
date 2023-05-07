const { pvxgroups } = require("../../constants/constants");
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

  //get all jids of admin
  const memberjidAllArray = [];
  for (let group of groups) {
    group.participants.forEach(async (mem) => {
      if (mem.admin && !memberjidAllArray.includes(mem.id)) {
        memberjidAllArray.push(mem.id);
      }
    });
  }

  //get all jids name from DB
  const res = await getUsernames(memberjidAllArray);

  //create object of { jid: name }
  const memberjidObj = {};
  if (res.length === memberjidAllArray.length) {
    res.forEach((mem) => {
      memberjidObj[mem.memberjid] = mem.name;
    });
  } else {
    reply("Some names are not found in DB.");
  }

  //create the message
  let pvxMsg = `*📛 PVX ADMIN LIST 📛\nTotal: ${memberjidAllArray.length}*${readMore}`;

  const subAdminPanel = [];
  //get all admins from sub admin panel
  chats[pvxgroups.pvxsubadmin].participants.forEach((mem) => {
    subAdminPanel.push(mem.id);
  });

  for (let group of groups) {
    let grpName = group.subject;
    grpName = grpName.replace("<{PVX}> ", "");
    pvxMsg += `\n\n📛 *${grpName}*`;
    count = 1;
    group.participants.forEach(async (mem) => {
      if (mem.admin) {
        //if name present
        if (memberjidObj[mem.id]) {
          pvxMsg += `\n${count}) ${memberjidObj[mem.id]}`;
        } else {
          pvxMsg += `\n${count}) ${mem.id}`;
        }

        if (!subAdminPanel.includes(mem.id)) {
          pvxMsg += " *[NOT IN SUB ADMIN PANEL]*";
        }
        count += 1;
      }
    });
  }

  await reply(pvxMsg);
};
