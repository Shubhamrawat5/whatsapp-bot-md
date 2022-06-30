const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const { getBlacklist } = require("../../../db/blacklistDB");

module.exports.command = () => {
  let cmd = ["blacklist"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { reply } = msgInfoObj;
  let blacklistRes = await getBlacklist();
  let blacklistMsg = "Blacklisted Numbers\n";
  blacklistRes.forEach((num) => {
    blacklistMsg += `\n${num.number}`;
  });

  reply(blacklistMsg);
};
