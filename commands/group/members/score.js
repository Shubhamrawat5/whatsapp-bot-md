const { MessageType, Mimetype } = require("@adiwajshing/baileys");

const { getCricketScore } = require("../../../functions/cricket");

module.exports.command = () => {
  let cmd = ["score"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  try {
    let { groupDesc } = msgInfoObj;

    if (!groupDesc) {
      sock.sendMessage(
        from,
        {
          text: `❌ ERROR
- Group description is empty.
- Put match ID in starting of group description. 
- Get match ID from cricbuzz today match url.
- example: https://www.cricbuzz.com/live-cricket-scores/37572/mi-vs-kkr-34th-match-indian-premier-league-2021 
- so match ID is 37572 !
# If you've put correct match ID in description starting and still facing this error then contact developer by !dev`,
        },
        { quoted: msg }
      );

      return;
    }

    let matchId = groupDesc.slice(0, 5);

    let response = await getCricketScore(matchId);

    //response.info have "MO" only when command is startc
    if (response.info === "ER") {
      sock.sendMessage(
        from,
        {
          text: `❌ ERROR
- Group description starting is "${matchId}"
- Put match ID in starting of group description. 
- Get match ID from cricbuzz today match url.
- example: https://www.cricbuzz.com/live-cricket-scores/37572/mi-vs-kkr-34th-match-indian-premier-league-2021 
- so match ID is 37572 !
# If you've put correct match ID in description starting and still facing this error then contact developer by !dev`,
        },
        { quoted: msg }
      );

      return;
    }
    sock.sendMessage(from, { text: response.message }, { quoted: msg });
  } catch (err) {
    console.log(err);
    sock.sendMessage(
      from,
      { text: "❌ There is some problem!" },
      { quoted: msg }
    );
  }
};
