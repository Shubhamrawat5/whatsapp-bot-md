const { MessageType, Mimetype } = require("@adiwajshing/baileys");

// 📛 ${prefix}wall text
// 📛 ${prefix}matrix text
// 📛 ${prefix}flame text
// 📛 ${prefix}fire text
// 📛 ${prefix}city text
// 📛 ${prefix}3d text
// 📛 ${prefix}logo text
// 📛 ${prefix}light text
// 📛 ${prefix}ff text
// 📛 ${prefix}neon text
// 📛 ${prefix}flower text
// 📛 ${prefix}sand text

// 📛 *${prefix}insta url* ❌
//   - _Instagram videos downloader!_
//   Alias: *${prefix}i url*📛
// 📛 *${prefix}fb url* ❌
//   - _Facebook videos downloader!_
// 📛 *${prefix}slist* ❌
//   - Get list of stickers command!_

// 📛 *${prefix}count*
//   - _Know your message count in current group!_

// 📛 *${prefix}total*
//   - _Know your message count in all PVX groups!_

module.exports.command = () => {
  let cmd = ["help", "h"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);

  let text = `*─「 🔥 <{PVX}> BOT 🔥 」─*
  ${readMore}
📛 *${prefix}sticker*
- _Create sticker from media!_
  Alias: *${prefix}s*
  
📛 *${prefix}sticker crop*
  - _Create full size sticker from media!_
  Alias: *${prefix}s c*

📛 *${prefix}image*
  - _Create image from sticker!_

📛 *${prefix}rank*
  - _Know your message count & rank in all PVX groups!_
  
📛 *${prefix}ranks*
  - _Know ranks list of PVX groups!_

📛 *${prefix}totalg*
  - _Know your message stats in all PVX groups!_
  
📛 *${prefix}ytv url*
  - _Youtube videos downloader!_

📛 *${prefix}yta url*
  - _Youtube audio downloader!_

📛 *${prefix}steal*
  - _Change sticker name to PVX BOT!_

📛 *${prefix}delete*
  - _Delete message of bot!_
  Alias: *${prefix}d*

📛 *${prefix}song name*
  - _Get songs in good quality!_
  [Better use ${prefix}yta command to download correct song from youtube]

📛 *${prefix}alive*
  - _Check if bot is ON or OFF!_
  Alias: *${prefix}a*

📛 *${prefix}cricketcommand*
  - _To get command details of cricket!_
  Alias: *${prefix}cc*

📛 *${prefix}votecommand*
  - _To get command details of voting!_
  Alias: *${prefix}vc*

📛 *${prefix}quote*
  - _Give a random quote!_

📛 *${prefix}gender firstname*
  - _Get gender from person first name!_
    
📛 *${prefix}technews*
  - _Get latest Tech news from inshorts !_ 

📛 *${prefix}pvxlink*
  - _Get links for all PVX groups!_
  Alias: *${prefix}link*

📛 *${prefix}donation*
  - _Get donation details and help PVX community!_

📛 *${prefix}feedback*
  - _Get feedback form!_

📛 *${prefix}rules*
  - _Get PVX groups rules!_
  Alias: *${prefix}r*

📛 *${prefix}source*
  - _Get bot source code!_

📛 *${prefix}dev*
  - _Get dev contact to report bug or to add new feature!_

📛 *${prefix}block*
  - _To block particular commands for this group!_

📛 *${prefix}91only*
  - _To instant ban all numbers other than 91 when joined in group!_

📛 *${prefix}help*
  - _To get list of public commands!_

📛 *${prefix}helpa*
  - _To get list of admin commands!_

📛 *${prefix}helpo*
  - _To get list of owner commands!_

✔️ more cool commands coming...`;

  sock.sendMessage(from, { text }, { quoted: msg });
};
