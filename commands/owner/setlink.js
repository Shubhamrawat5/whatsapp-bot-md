const { setGroupLink, setGroupLinkEnabled } = require("../../db/grouplinksDB");

module.exports.command = () => {
  let cmd = ["setlink", "linkset", "sl", "ls"];

  return { cmd, handler };
};

const handler = async (bot, msg, from, msgInfoObj) => {
  let { prefix, reply, args } = msgInfoObj;
  if (args.length === 0) {
    await reply(`❌ Wrong query!\nSend ${prefix}setlink link`);
    return;
  }

  if (args[0].startsWith("#")) {
    const enabled = Number(args[0].slice(1));

    const res = await setGroupLinkEnabled(enabled);

    if (res) await reply(`✔ Group link enabled updated with value: ${enabled}`);
    else
      await reply(
        `❌ There is some problem!\nGive only integer value with ${setlink} #0`
      );
    return;
  }

  let link;
  if (args.length === 1) {
    link = args[0];
  } else if (args.length === 2) {
    from = args[0];
    link = args[1];
  } else {
    await reply(`❌ Wrong query!\nSend ${prefix}setlink link`);
    return;
  }

  if (!from.endsWith("@g.us")) {
    await reply(`❌ Wrong groupjid!\nSend ${prefix}setlink link`);
    return;
  }

  if (!link.startsWith("https://chat.whatsapp.com/")) {
    await reply(`❌ Wrong grouplink!\nSend ${prefix}setlink link`);
    return;
  }

  const res = await setGroupLink(from, link);
  if (res) await reply(`✔ Group link updated!`);
  else await reply(`❌ There is some problem!`);
};
