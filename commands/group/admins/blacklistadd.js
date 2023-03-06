const { addBlacklist } = require("../../../db/blacklistDB");

module.exports.command = () => {
  let cmd = ["blacklistadd", "addblacklist", "bla"];

  return { cmd, handler };
};

const handler = async (bot, msg, from, msgInfoObj) => {
  let { prefix, reply, args } = msgInfoObj;

  if (args.length < 2) {
    await reply(`❌ Wrong query!\nSend ${prefix}bla number reason`);
    return;
  }

  let blacklistNumb = args[0];
  if (!Number(blacklistNumb)) {
    await reply(
      `❌ Give 10 digit Indian number (without spaces) with reason to add in blacklist by ${prefix}bla number reason`
    );
    return;
  }

  let reason = args.slice(1).join(" ");
  if (!reason) {
    await reply(`❌ Incorrect reason!\nSend ${prefix}bla number reason`);
    return;
  }

  if (blacklistNumb.startsWith("+")) {
    blacklistNumb = blacklistNumb.slice(1);
  }
  if (!blacklistNumb.startsWith("91")) {
    blacklistNumb = "91" + blacklistNumb;
  }

  if (blacklistNumb.length !== 12) {
    await reply(
      `❌ Give 10 digit Indian number (without spaces) with reason to add in blacklist by ${prefix}bla number reason`
    );
    return;
  }

  let blacklistRes = await addBlacklist(blacklistNumb, reason);
  if (blacklistRes) await reply("✔️ Added to blacklist!");
  else await reply("❌ Error!");
};
