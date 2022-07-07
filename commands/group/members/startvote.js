const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const { getVotingData, setVotingData } = require("../../../db/VotingDB");

module.exports.command = () => {
  let cmd = ["startvote"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix, reply, sender } = msgInfoObj;
  if (args.length === 0) {
    reply(
      `❌ Give some values seperated with # to vote on like ${prefix}startvote #title #name1 #name2 #name3`
    );
    return;
  }
  let votingResult = await getVotingData(from);
  if (votingResult.is_started) {
    reply(`❌ Voting already going on, Stop by ${prefix}stopvote command`);
    return;
  }
  let body = msg.message.conversation;
  // let voteChoices = body.trim().replace(/ +/, ",").split(/,/).slice(1);
  let voteList = body.trim().replace(/ +/, ",").split(",")[1].split("#");
  let voteTitle = voteList[1].trim();
  let voteChoices = voteList.slice(2);

  if (voteChoices.length < 2) {
    reply("❌ Give more than 1 voting choices!");
    return;
  }

  let voteListCount = new Array(voteChoices.length).fill(0); //[0,0,0]
  let voteListMember = [];
  for (let i = 0; i < voteChoices.length; ++i) voteListMember.push([]);

  await setVotingData(
    from,
    true,
    sender,
    voteTitle,
    voteChoices,
    voteListCount,
    voteListMember,
    []
  );
  votingResult = await getVotingData(from);

  let voteMsg = `*Voting started!*\nsend "${prefix}vote number" to vote\n\n*🗣️ ${voteTitle}*`;

  votingResult.choices.forEach((name, index) => {
    voteMsg += `\n${index + 1} for [${name.trim()}]`;
  });

  voteMsg += `\n\n_send ${prefix}checkvote or ${prefix}cv to see current status and ${prefix}stopvote to stop voting and see the result._`;
  reply(voteMsg);
};
