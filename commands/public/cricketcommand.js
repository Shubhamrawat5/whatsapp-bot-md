const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  let cmd = ["cricketcommand", "cc"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix } = msgInfoObj;
  let text = `_*🏏  CRICKET COMMANDS:*_

- Put matchID in starting of group description.
- Get match ID from cricbuzz today match url.
- example: https://www.cricbuzz.com/live-cricket-scores/37572/mi-vs-kkr-34th-match-indian-premier-league-2021 
- so match ID is 37572 !

📛 *${prefix}score*
  - _current score of match!_
📛 *${prefix}scorecard*
  - _current scorecard of players!_
    Alias: ${prefix}sc ${prefix}sb
📛 *${prefix}startc*
  - _start match live score every 1 min!_
📛 *${prefix}stopc*
  - _Stop match live score!_`;

  sock.sendMessage(from, { text }, { quoted: msg, detectLinks: false });
};
