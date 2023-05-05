const {
  setMilestone,
  getMilestone,
  getMilestoneText,
} = require("../../db/milestoneDB");

module.exports.command = () => {
  let cmd = ["milestoneadd", "addmilestone", "ma", "am"];

  return { cmd, handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  const { reply, prefix } = msgInfoObj;

  let body = msg.message.conversation;
  let milestoneList = body.trim().split("#");
  if (milestoneList.length !== 3) {
    await reply(
      `❌ Give correct details\nCommand: ${prefix}milestoneadd #contact #sno`
    );
    return;
  }
  let contact = milestoneList[1].trim();
  let sno = Number(milestoneList[2].trim());

  if (!contact || !sno) {
    await reply(
      `❌ Give correct details\nCommand: ${prefix}milestoneadd #contact #sno`
    );
    return;
  }

  if (contact.length !== 12) {
    await reply(
      `❌ Give correct Indian number with country code and no spaces\nCommand: ${prefix}milestoneadd #contact #sno`
    );
    return;
  }

  const milestoneTextRes = await getMilestoneText();
  if (!sno || sno < 0 || sno > milestoneTextRes.length) {
    await reply(
      `❌ Give correct serial number within the range\nTo know the sno: ${prefix}milestone`
    );
    return;
  }

  const memberJid = `${contact}@s.whatsapp.net`;
  const achievedText = milestoneTextRes[sno - 1].milestone;

  let achieved;
  const milestoneRes = await getMilestone(memberJid);
  if (milestoneRes.length) {
    if (milestoneRes[0].achieved.includes(achievedText)) {
      await reply(
        `❌ Milestone "${achievedText}" is already added to ${contact}`
      );
      return;
    }

    achieved = milestoneRes[0].achieved;
    achieved.push(achievedText);
  } else {
    achieved = [achievedText];
  }

  const res = await setMilestone(memberJid, achieved);
  if (res) await reply(`✔ Milestone added!`);
  else await reply(`❌ There is some problem!`);
};

// const handler = async (bot, msg, msgInfoObj) => {
//   const { reply, args } = msgInfoObj;

//   if (args.length === 0) {
//     await reply(`❌ Give !milestoneaddtext milestoneText`);
//     return;
//   }

//   const milestoneText = args.join(" ");

//   const res = await setMilestoneText(milestoneText);
//   if (res) await reply(`✔ Milestone text added!`);
//   else await reply(`❌ There is some problem!`);
// };
