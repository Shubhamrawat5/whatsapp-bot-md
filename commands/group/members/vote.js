const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const { getVotingData, setVotingData } = require("../../../db/VotingDB");

module.exports.command = () => {
  let cmd = ["vote"];

  return { cmd, handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix, reply, sender, senderName } = msgInfoObj;
  let votingResult = await getVotingData(from);
  if (!votingResult.is_started) {
    reply(
      `❌ Voting is not started here, Start by \n${prefix}startvote #title #name1 #name2 #name3`
    );
    return;
  }
  if (votingResult.voted_members.includes(sender)) {
    reply("❌ You already voted.");
    return;
  }
  if (args.length === 0) {
    reply("❌ Give value to vote on!");
    return;
  }

  let voteNumber = Math.floor(Number(args[0]));
  if (isNaN(voteNumber)) {
    reply("❌ Give a number!");
    return;
  }

  if (voteNumber > votingResult.count.length || voteNumber < 1) {
    reply("❌ Number out of range!");
    return;
  }

  votingResult.count[voteNumber - 1] += 1; //increase vote
  votingResult.members_voted_for[voteNumber - 1].push(senderName); // save who voted
  votingResult.voted_members.push(sender); //member voted

  await setVotingData(
    from,
    true,
    votingResult.started_by,
    votingResult.title,
    votingResult.choices,
    votingResult.count,
    votingResult.members_voted_for,
    votingResult.voted_members
  );

  reply(`_✔ Voted for [${votingResult.choices[voteNumber - 1].trim()}]_`);
};
