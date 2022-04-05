const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  return { cmd: "helpr", handler: handler };
};

const handler = async (sock, msg, from, args, prefix) => {
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);

  let text = `*─「 🔥 <{PVX}> BOT 🔥 」─*
  ${readMore}
_Restricted command for owner only!_
  
📛 *${prefix}test query*
  - _Execute code with whatsapp directly!_

📛 *${prefix}tagall*
  - _Tag all the members!_  

📛 *${prefix}deleteauth*
  - _Delete auth DB to get new qr scan!_

📛 *${prefix}groupbackup*
  - _Take backup of group in DB!_  

📛 *${prefix}gname*
  - _Save all group name in DB!_  

📛 *${prefix}countstats*
  - _Get stats of number of command used!_  

📛 *${prefix}blacklistadd*
  - _Add number to blacklist!_
Alias: *${prefix}bla*

📛 *${prefix}blacklistremove*
  - Remove number from blacklist!_  
Alias: *${prefix}blr*

📛 *${prefix}tg*
  - _Make TG to WA stickers!_

📛 *${prefix}stg*
  - _Stop TG to WA stickers!_
  
📛 *${prefix}startvotepvx*
  - _Start vote for all pvx groups!_
  
📛 *${prefix}stopvotepvx*
  - _Stop vote for all pvx groups!_

📛 *${prefix}donationadd*
  - _add by giving after command #name #amount!_`;

  sock.sendMessage(from, { text }, { quoted: msg });
};
