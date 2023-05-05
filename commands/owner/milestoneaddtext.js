const {
  setMilestone,
  getMilestone,
  setMilestoneText,
} = require("../../db/milestoneDB");

module.exports.command = () => {
  let cmd = ["milestoneaddtext", "milestonetextadd", "mat", "mta"];

  return { cmd, handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  const { reply, args } = msgInfoObj;

  if (args.length === 0) {
    await reply(`❌ Give !milestoneaddtext milestoneText`);
    return;
  }

  const milestoneText = args.join(" ");

  const res = await setMilestoneText(milestoneText);
  if (res) await reply(`✔ Milestone text added!`);
  else await reply(`❌ There is some problem!`);
};

// const handler = async (bot, msg, msgInfoObj) => {
//   const { reply, args } = msgInfoObj;

//   if (args.length <= 1) {
//     await reply(`❌ Give !milestoneadd number milestoneText`);
//     return;
//   }

//   const number = args[0];
//   if (number.length !== 12) {
//     await reply(
//       `❌ Give correct Indian number with country code\nCommand: !milestoneadd number milestoneText`
//     );
//     return;
//   }

//   const memberJid = `${number}@s.whatsapp.net`;
//   const achievedText = args.slice(1).join(" ");
//   let achieved = [achievedText];
//   const milestoneRes = await getMilestone(memberJid);
//   if (milestoneRes.length) {
//     achieved = milestoneRes[0].achieved;
//     achieved.push(achievedText);
//   }

//   const res = await setMilestone(memberJid, achieved);
//   if (res) await reply(`✔ Milestone added!`);
//   else await reply(`❌ There is some problem!`);
// };
