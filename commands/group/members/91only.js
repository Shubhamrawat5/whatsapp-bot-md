const { MessageType, Mimetype } = require("@adiwajshing/baileys");

module.exports.command = () => {
  let cmd = ["91only"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix } = msgInfoObj;

  let text = `*─「 <{PVX}> BOT 」 ─*
  
_- To instant ban all the numbers other than 91 code, when added to group!_

_- Give text "only91" (without quotes) in first line of group description_

_- If other commands is also to be added in description, like matchID or blocked commands then insert text "only91" anywhere like (but remember cricket id should always be in starting)_
82621,score,only91,quote`;

  sock.sendMessage(from, { text }, { quoted: msg });
};
