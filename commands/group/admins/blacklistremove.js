const { removeBlacklist } = require("../../../db/blacklistDB");

module.exports.command = () => {
  let cmd = ["blacklistremove", "removeblacklist", "blr"];

  return { cmd, handler };
};

const handler = async (bot, msg, from, msgInfoObj) => {
  let { prefix, reply, args } = msgInfoObj;
  let blacklistNumb = args[0];
  if (!Number(blacklistNumb)) {
    await reply(
      `❌ Give correct Indian number (without spaces) to remove from blacklist by ${prefix}blr number`
    );
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
      `❌ Give correct Indian number (without spaces) to remove from blacklist by ${prefix}blr number`
    );
    return;
  }

  let blacklistRes1 = await removeBlacklist(blacklistNumb);
  if (blacklistRes1) await reply("✔️ Removed from blacklist!");
  else await reply("❌ Error!");
};
