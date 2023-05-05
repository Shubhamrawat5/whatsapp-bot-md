const { getCricketScore } = require("../../functions/cricket");
let cricSetIntervalGroups = {}; //to store every group name with its setInterval value so that it can be stopped
let matchIdGroups = {}; //to store every group name with its match ID
let cricStartedGroups = {}; //to store every group name with boolean value to know if cricket score is already started or not

//return false when stopped in middle. return true when run fully
// const startcHelper = async (isFromSetInterval = false) => {
//   if (!groupDesc) {
//     await reply(
//       `❌ ERROR\n- Group description is empty.\n- Put match ID in starting of group description.\n- Get match ID from cricbuzz today match url.\n- example: https://www.cricbuzz.com/live-cricket-scores/37572/mi-vs-kkr-34th-match-indian-premier-league-2021 \n- so match ID is 37572 !\n# If you've put correct match ID in description starting and still facing this error then contact developer by !dev`
//     );

//     return false;
//   }

//   matchIdGroups[groupName] = groupDesc.slice(0, 5);
//   if (!isFromSetInterval) {
//     await reply(
//       "✔️ Starting Cricket scores for matchID: " +
//         matchIdGroups[groupName] +
//         " (taken from description)"
//     );
//   }

//   let response = await getCricketScore(matchIdGroups[groupName]);

//   //response.info have "MO" only when command is startc
//   if (response.info === "MO") {
//     await bot.sendMessage(from, { text: response.message });
//     await reply("✔️ Match over! Stopping Cricket scores for this group !");
//     console.log("Match over! Stopping Cricket scores for " + groupName);
//     clearInterval(cricSetIntervalGroups[groupName]);
//     cricStartedGroups[groupName] = false;
//     return false;
//   } else if (response.info === "IO") {
//     await bot.sendMessage(from, { text: response.message });
//     await reply(
//       "✔️ Inning over! Open again live scores later when 2nd inning will start by !startc"
//     );
//     await reply("✔️ Stopping Cricket scores for this group !");
//     console.log("Stopping Cricket scores for " + groupName);
//     clearInterval(cricSetIntervalGroups[groupName]);
//     cricStartedGroups[groupName] = false;
//     return false;
//   } else if (response.info === "ER") {
//     await reply(
//       `❌ ERROR\n- Group description starting is "${matchIdGroups[groupName]}"\n- Put match ID in starting of group description. \n- Get match ID from cricbuzz today match url.\n- example: https://www.cricbuzz.com/live-cricket-scores/37572/mi-vs-kkr-34th-match-indian-premier-league-2021 \n- so match ID is 37572 !\n# If you've put correct match ID in description starting and still facing this error then contact developer by !dev`
//     );
//     return false;
//   }
//   await bot.sendMessage(from, { text: response.message });
//   return true;
// };

module.exports.command = () => {
  let cmd = ["startc", "stopc"];

  return { cmd, handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  let { reply, command, groupName } = msgInfoObj;

  reply("❌ Command temporary disabled");

  // switch (command) {
  //   case "startc":
  //     if (cricStartedGroups[groupName]) {
  //       await reply("❌ CRICKET SCORES already started for this group!");
  //       return;
  //     }

  //     let respCric = await startcHelper("startc");
  //     if (!respCric) return;

  //     cricStartedGroups[groupName] = true;
  //     cricSetIntervalGroups[groupName] = setInterval(async () => {
  //       respCric = await startcHelper("startc", true);
  //       if (!respCric) return;
  //     }, 1000 * 90); //1 min
  //     return;

  //   case "stopc":
  //     if (cricStartedGroups[groupName]) {
  //       await reply("✔️ Stopping Cricket scores for this group !");
  //       console.log("Stopping Cricket scores for " + groupName);
  //       clearInterval(cricSetIntervalGroups[groupName]);
  //       cricStartedGroups[groupName] = false;
  //     } else await reply("❌ CRICKET scores was never started for this group!");
  //     return;
  // }

  // Object.keys(cricSetIntervalGroups).forEach((e) => {
  //   clearInterval(e);
  // });
};
