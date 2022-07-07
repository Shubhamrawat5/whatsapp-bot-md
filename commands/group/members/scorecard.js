const { MessageType, Mimetype } = require("@adiwajshing/baileys");

const axios = require("axios");

const getScoreCard = async (matchID) => {
  try {
    let { data } = await axios.get(
      "https://cricket-scorecard-2021.herokuapp.com/scorecard/" + matchID
    );
    let firstInningTeam = "",
      secondInningTeam = "",
      firstInningTeamScore = "",
      secondInningTeamScore = "";
    firstInningTeam = data.Innings1[2].team;
    firstInningTeamScore = data.Innings1[2].score;
    let message = `*${firstInningTeam} 🏏*\nscore: ${firstInningTeamScore}\n`;
    if (Object.keys(data.Innings2[2]).length) {
      secondInningTeam = data.Innings2[2].team;
      secondInningTeamScore = data.Innings2[2].score;
    }

    data.Innings1[0].Batsman.forEach((player) => {
      message += `\n${player.runs} (${player.balls}) : ${player.name}`;
      if (player.dismissal == "batting") message += `*`;
    });

    if (secondInningTeam) {
      message += `\n\n*${secondInningTeam} 🏏*\nscore: ${secondInningTeamScore}\n`;
      data.Innings2[0].Batsman.forEach((player) => {
        message += `\n${player.runs} (${player.balls}) : ${player.name}`;
        if (player.dismissal == "batting") message += `*`;
      });
    }
    return message;
  } catch (err) {
    console.log(err);
    return "";
  }
};

module.exports.command = () => {
  let cmd = ["scorecard", "scoreboard", "sc", "sb"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { groupDesc, reply } = msgInfoObj;

  if (!groupDesc) {
    reply(`❌ ERROR
- Group description is empty.
- Put match ID in starting of group description. 
- Get match ID from cricbuzz today match url.
- example: https://www.cricbuzz.com/live-cricket-scores/37572/mi-vs-kkr-34th-match-indian-premier-league-2021 
- so match ID is 37572 !
# If you've put correct match ID in description starting and still facing this error then contact developer by !dev`);

    return;
  }

  let matchId = groupDesc.slice(0, 5);

  let response = await getScoreCard(matchId);

  //response.info have "MO" only when command is startc
  if (!response) {
    reply(`❌ ERROR
- Group description starting is "${matchId}"
- Put match ID in starting of group description. 
- Get match ID from cricbuzz today match url.
- example: https://www.cricbuzz.com/live-cricket-scores/37572/mi-vs-kkr-34th-match-indian-premier-league-2021 
- so match ID is 37572 !
# If you've put correct match ID in description starting and still facing this error then contact developer by !dev`);

    return;
  }
  sock.sendMessage(from, { text: response }, { quoted: msg });
};
