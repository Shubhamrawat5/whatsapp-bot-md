const { getScoreCard } = require("../../functions/cricket");

module.exports.command = () => {
  let cmd = ["scorecard", "scoreboard", "sc", "sb"];

  return { cmd, handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  let { groupDesc, reply, from } = msgInfoObj;
  const descErrorMessage = `❌ ERROR
- Group description is empty.
- Put match ID in starting of group description. 
- Get match ID from cricbuzz today match url.
- example: https://www.cricbuzz.com/live-cricket-scores/37572/mi-vs-kkr-34th-match-indian-premier-league-2021 
- so match ID is 37572 !
# If you've put correct match ID in description starting and still facing this error then contact developer by !dev`;

  if (!groupDesc) {
    await reply(descErrorMessage);
    return;
  }

  let matchId = groupDesc.slice(0, 5);
  if (isNaN(Number(matchId))) {
    await reply(descErrorMessage);
    return;
  }

  let response = await getScoreCard(matchId);

  //response.info have "MO" only when command is startc
  //   if (!response) {
  //     await reply(`❌ ERROR
  // - Group description starting is "${matchId}"
  // - Put match ID in starting of group description.
  // - Get match ID from cricbuzz today match url.
  // - example: https://www.cricbuzz.com/live-cricket-scores/37572/mi-vs-kkr-34th-match-indian-premier-league-2021
  // - so match ID is 37572 !
  // # If you've put correct match ID in description starting and still facing this error then contact developer by !dev`);

  //     return;
  //   }
  await bot.sendMessage(from, { text: response }, { quoted: msg });
};
