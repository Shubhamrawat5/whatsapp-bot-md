const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const { getVotingData, stopVotingData } = require("../../../db/VotingDB");

module.exports.command = () => {
  let cmd = ["stopvote"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix, reply, isGroupAdmins, sender } = msgInfoObj;
  let votingResult = await getVotingData(from);
  if (!votingResult.is_started) {
    reply(
      `❌ Voting is not started here, Start by \n${prefix}startvote #title #name1 #name2 #name3`
    );
    return;
  }

  let resultVoteMsg = "";
  if (votingResult.started_by === sender || isGroupAdmins) {
    await stopVotingData(from);
    resultVoteMsg += `*Voting Result:*\n🗣️ ${votingResult.title}`;
  } else {
    reply(
      "❌ Only admin or that member who started the voting, can stop current voting!"
    );
    return;
  }

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
};
