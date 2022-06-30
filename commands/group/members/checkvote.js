const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const { getVotingData } = require("../../../db/VotingDB");

module.exports.command = () => {
  let cmd = ["checkvote", "cv"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix, reply } = msgInfoObj;
  try {
    let votingResult = await getVotingData(from);
    if (!votingResult.is_started) {
      reply(
        `❌ Voting is not started here, Start by \n${prefix}startvote #title #name1 #name2 #name3`
      );
      return;
    }

    let resultVoteMsg = "";

    resultVoteMsg += `send "${prefix}vote number" to vote\n\n*🗣️ ${votingResult.title}*`;
    votingResult.choices.forEach((name, index) => {
      resultVoteMsg += `\n${index + 1} for [${name.trim()}]`;
    });
    resultVoteMsg += `\n\n*Voting Current Status:*`;

    let totalVoted = votingResult.voted_members.length;

    votingResult.choices.forEach((name, index) => {
      resultVoteMsg += `\n======= ${(
        (votingResult.count[index] / totalVoted) *
        100
      ).toFixed()}% =======\n📛 *[${name.trim()}] : ${
        votingResult.count[index]
      }*\n`;

      //add voted members username
      votingResult.members_voted_for[index].forEach((mem) => {
        resultVoteMsg += `_${mem},_ `;
      });
    });
    reply(resultVoteMsg);
  } catch (err) {
    console.log(err);
    reply(`❌ Error!`);
  }
};
