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

  if (res.length != memberjidAllArray.length) {
    reply("Some names are not found in DB.");
  }

  //create object of { jid: name }
  const memberjidObj = {};
  res.forEach((mem) => {
    memberjidObj[mem.memberjid] = mem.name;
  });

  //create the message
  let pvxMsg = `*📛 PVX ADMIN LIST 📛*\nTotal: ${memberjidAllArray.length}${readMore}`;

  const subAdminPanel = [];
  //get all admins from sub admin panel
  chats[pvxgroups.pvxsubadmin].participants.forEach((mem) => {
    subAdminPanel.push(mem.id);
  });

  let notInSubPanel = {};
  let notInSubPanelMsg = "\n\n[NOT IN SUB ADMIN PANEL]";

  let tempMsg = "";
  for (let group of groups) {
    let grpName = group.subject;
    grpName = grpName.replace("<{PVX}> ", "");
    tempMsg += `\n\n*[${grpName}]*`;
    count = 1;
    group.participants.forEach(async (mem) => {
      if (mem.admin) {
        const id = mem.id;
        const name = memberjidObj[id];
        //if name present
        // if (name) {
        //   tempMsg += `\n${count}) ${name}`;
        // } else {
        //   tempMsg += `\n${count}) ${id}`;
        // }

        tempMsg += `\n${count}) ${name}`;

        if (!subAdminPanel.includes(id) && !notInSubPanel[id]) {
          notInSubPanel[id] = name;
          notInSubPanelMsg += `\n- ${name}`;
        }
        count += 1;
      }
    });
  }

  if (Object.keys(notInSubPanel).length) {
    pvxMsg += notInSubPanelMsg;
  }
  pvxMsg += tempMsg;

  await reply(pvxMsg);
};
