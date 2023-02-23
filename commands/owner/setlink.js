const { setGroupLink, setGroupLinkEnabled } = require("../../db/grouplinksDB");

module.exports.command = () => {
  let cmd = ["setlink", "sl"];

  return { cmd, handler };
};

const handler = async (bot, msg, from, msgInfoObj) => {
  let { prefix, reply, args } = msgInfoObj;
  try {
    if (args[0]) {
      const enabled = Number(args[0]);

      const res = await setGroupLinkEnabled(enabled);

      if (res)
        await reply(`✔ Group link enabled updated with value: ${enabled}`);
      else
        await reply(
          `❌ There is some problem!\nGive only integer value with ${setlink} #0`
        );
      return;
    }

    let link = await bot.groupInviteCode(from);

    if (!from.endsWith("@g.us")) {
      await reply(`❌ Wrong groupjid!`);
      return;
    }

    if (!link.startsWith("https://chat.whatsapp.com/")) {
      await reply(`❌ Wrong grouplink!`);
      return;
    }

    const res = await setGroupLink(from, link);
    if (res) await reply(`✔ Group link updated in DB!`);
    else await reply(`❌ There is some problem!`);
  } catch (err) {
    await reply(err.toString());
    return;
  }
};
