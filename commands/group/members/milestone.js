module.exports.command = () => {
  let cmd = ["milestone", "milestones"];

  return { cmd, handler };
};

const handler = async (bot, msg, from, msgInfoObj) => {
  let { prefix, reply } = msgInfoObj;

  let text = `*─「 <{PVX}> MILESTONES 」 ─*
  
Send ${prefix}rank to know your rank with milestones.
  
⭐ Main admin of PVX
⭐ Sub admin of PVX
⭐ Top 50 member of PVX
⭐ Top 20 member of PVX
⭐ Top 10 member of PVX
⭐ Super donator of PVX
⭐ Donator of PVX`;

  await reply(text);
};
