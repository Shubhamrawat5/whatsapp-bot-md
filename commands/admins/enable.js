const {
  getDisableCommandData,
  setDisableCommandData,
} = require("../../db/disableCommandDB");

module.exports.command = () => {
  let cmd = ["enable"];

  return { cmd, handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  let { reply, args, allCommandsName, prefix, from } = msgInfoObj;

  if (args.length === 0) {
    await reply("❌ Give command name also by !enable commandName");
    return;
  }
  let cmd = args[0].toLowerCase();
  if (cmd.startsWith("!")) cmd = cmd.slice(1);

  //check if cmd is actually a command or not
  if (!allCommandsName.includes(cmd)) {
    await reply(`❌ ${prefix}${cmd} is not a command!`);
    return;
  }

  let res = await getDisableCommandData(from);

  if (!res.includes(cmd)) {
    await reply(`❌ ${prefix}${cmd} is already enabled!`);
    return;
  }

  resNew = res.filter((c) => {
    return cmd != c;
  });

  await setDisableCommandData(from, resNew);

  await reply(`✔️ ${prefix}${cmd} command enabled!`);
};
