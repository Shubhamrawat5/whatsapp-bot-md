const { getMessage } = require("../../functions/getMessage");

module.exports.command = () => {
  let cmd = ["tagall", "hiddentagall", "tagallhidden"];

  return { cmd, handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  let { groupMembers, prefix, command, from } = msgInfoObj;
  //if (
  //  groupName.toUpperCase().includes("PVX") &&
  //  ![myNumber + "@s.whatsapp.net", botNumberJid].includes(sender)
  //) {
  //  await reply(`❌ Owner only command for avoiding spam in PVX Groups!`);
  //  return;
  //}

  let jids = [];
  let message = "ALL: " + (await getMessage(msg, prefix, command)) + "\n\n";

  for (let member of groupMembers) {
    if (command === "tagall") message += "@" + member.id.split("@")[0] + " ";
    jids.push(member.id);
  }

  await bot.sendMessage(
    from,
    { text: message, mentions: jids },
    { quoted: msg }
  );
};
