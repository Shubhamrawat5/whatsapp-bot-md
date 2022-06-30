const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const { addBlacklist } = require("../../../db/blacklistDB");

module.exports.command = () => {
  let cmd = ["blacklistadd", "bla"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix, reply } = msgInfoObj;
  let blacklistNumb2 = args[0];
  if (!Number(blacklistNumb2)) {
    reply(`❌ Give number to add in blacklist by ${prefix}bla number!`);
    return;
  }
  if (blacklistNumb2.startsWith("+")) {
    blacklistNumb2 = blacklistNumb2.slice(1);
  }

  if (blacklistNumb2.length === 10 && !blacklistNumb2.startsWith("91")) {
    blacklistNumb2 = "91" + blacklistNumb2;
  }

  let blacklistRes2 = await addBlacklist(blacklistNumb2);
  if (blacklistRes2) reply("✔️ Added to blacklist!");
  else reply("❌ Error!");
};
