module.exports.command = () => {
  let cmd = ["helpa"];

  return { cmd, handler };
};

const handler = async (bot, msg, from, msgInfoObj) => {
  let { prefix, reply } = msgInfoObj;
  const more = String.fromCharCode(8206);
  const readMore = more.repeat(4001);

  let text = `*─「 🔥 <{PVX}> BOT 🔥 」─*
  ${readMore}
_Admin commands only!_

📛 *${prefix}add <phone number>*
  - _Add new member!_
 [or tag message of removed member with *${prefix}add*]
 
📛 *${prefix}kick <mention>*
  - _Kick member from group!_
 [or tag message of member with *${prefix}kick*]

📛 *${prefix}mute | ${prefix}unmute*
  - _Mute and Unmute the group!_

📛 *${prefix}delete*
  - _Delete anyone message!_
Alias: *${prefix}d*

📛 *${prefix}tagall* 
  - _Tag all the members!_  
Alias: *${prefix}tagallhidden*

📛 *${prefix}disable <command>*
  - _Disable command for current group!_

📛 *${prefix}enable <command>*
  - _Enable command for current group!_

📛 *${prefix}rt*
  - _Tag a random member!_  

📛 *${prefix}warning*
  - _Give warning to user!_
Alias: *${prefix}warn*

📛 *${prefix}warninglist*
  - _Check warning of all members!_
Alias: *${prefix}warnlist*

📛 *${prefix}warningreduce*
  - Reduce warning to user!_
Alias: *${prefix}warnreduce*

📛 *${prefix}warningclear*
  - _Clear all warning to user!_
Alias: *${prefix}warnclear*

📛 *${prefix}warningcheck*
  - Check warning to user!_
Alias: *${prefix}warncheck*

📛 *${prefix}blacklist*
  - _Get blacklist numbers!_ 

📛 *${prefix}blacklistadd*
  - _Add number to blacklist!_
Alias: *${prefix}bla*

📛 *${prefix}blacklistremove*
  - Remove number from blacklist!_  
Alias: *${prefix}blr*

send ${prefix}source for sourcecode of BOT
✔️ more cool commands coming...`;

  await reply(text);
};
