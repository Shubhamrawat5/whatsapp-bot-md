const { removeBlacklist } = require("../../../db/blacklistDB");

module.exports.command = () => {
  let cmd = ["blacklistremove", "blr"];

  return { cmd, handler };
};

const handler = async (bot, msg, from, msgInfoObj) => {
  let { prefix, reply, args } = msgInfoObj;
  let blacklistNumb1 = args[0];
  if (!Number(blacklistNumb1)) {
    await reply(
      `❌ Give number to remove from blacklist by ${prefix}blr number!`
    );
    return;
  }
  if (blacklistNumb1.startsWith("+")) {
    blacklistNumb1 = blacklistNumb1.slice(1);
  }
  if (blacklistNumb1.length === 10 && !blacklistNumb1.startsWith("91")) {
    blacklistNumb1 = "91" + blacklistNumb1;
  }

  let blacklistRes1 = await removeBlacklist(blacklistNumb1);
  if (blacklistRes1) await reply("✔️ Removed from blacklist!");
  else await reply("❌ Error!");
};
