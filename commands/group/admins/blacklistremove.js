const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const { removeBlacklist } = require("../../../db/blacklistDB");

module.exports.command = () => {
  let cmd = ["blacklistremove", "blr"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix, reply } = msgInfoObj;
  let blacklistNumb1 = args[0];
  if (!Number(blacklistNumb1)) {
    reply(`❌ Give number to remove from blacklist by ${prefix}blr number!`);
    return;
  }
  if (blacklistNumb1.startsWith("+")) {
    blacklistNumb1 = blacklistNumb1.slice(1);
  }
  if (blacklistNumb1.length === 10 && !blacklistNumb1.startsWith("91")) {
    blacklistNumb1 = "91" + blacklistNumb1;
  }

  let blacklistRes1 = await removeBlacklist(blacklistNumb1);
  if (blacklistRes1) reply("✔️ Removed from blacklist!");
  else reply("❌ Error!");
};
