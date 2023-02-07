const { setMilestone, getMilestone } = require("../../../db/milestoneDB");

module.exports.command = () => {
  let cmd = ["milestoneadd", "addmilestone", "ma"];

  return { cmd, handler };
};

const handler = async (bot, msg, from, msgInfoObj) => {
  const { reply, args } = msgInfoObj;

  if (args.length <= 1) {
    await reply(`❌ Give !milestoneadd number milestoneText`);
    return;
  }

  const number = args[0];
  if (number.length !== 12) {
    await reply(
      `❌ Give correct Indian number with country code\nCommand: !milestoneadd number milestoneText`
    );
    return;
  }

  const memberJid = `${number}@s.whatsapp.net`;
  const achievedText = args.slice(1).join(" ");
  let achieved = [achievedText];
  const milestoneRes = await getMilestone(memberJid);
  if (milestoneRes.length) {
    console.log(milestoneRes[0]);
    console.log(milestoneRes[0].achieved);
    achieved = milestoneRes[0].achieved;
    achieved.push(achievedText);
  }

  const res = await setMilestone(memberJid, achieved);
  if (res) await reply(`✔ Milestone added!`);
  else await reply(`❌ There is some problem!`);
};
