const { addBlacklist } = require("../../../db/blacklistDB");

module.exports.command = () => {
  let cmd = ["blacklistadd", "bla"];

  return { cmd, handler };
};

const handler = async (bot, msg, from, msgInfoObj) => {
  let { prefix, reply, args } = msgInfoObj;
  let blacklistNumb2 = args[0];
  if (!Number(blacklistNumb2)) {
    await reply(`❌ Give number to add in blacklist by ${prefix}bla number!`);
    return;
  }
  if (blacklistNumb2.startsWith("+")) {
    blacklistNumb2 = blacklistNumb2.slice(1);
  }

  if (blacklistNumb2.length === 10 && !blacklistNumb2.startsWith("91")) {
    blacklistNumb2 = "91" + blacklistNumb2;
  }

  let blacklistRes2 = await addBlacklist(blacklistNumb2);
  if (blacklistRes2) await reply("✔️ Added to blacklist!");
  else await reply("❌ Error!");
};
