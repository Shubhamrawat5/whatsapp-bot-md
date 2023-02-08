const { getCountTop } = require("../db/countMemberDB");
const { getDonation } = require("../db/donationDB");
const pvxadmin = "919557666582-1498394056@g.us";
const pvxsubadmin = "120363049192218305@g.us";

module.exports.addMilestones = async (groupFetchAllParticipating) => {
  const milestones = {};
  console.log("Adding milestones");

  let chats = await groupFetchAllParticipating();

  chats[pvxsubadmin].participants.forEach((member) => {
    milestones[member.id] = ["Sub admin of PVX"];
  });
  chats[pvxadmin].participants.forEach((member) => {
    milestones[member.id] = ["Main admin of PVX"];
  });

  const resultCountGroupTop = await getCountTop(50);
  resultCountGroupTop.forEach((member, index) => {
    let memberjid = member.memberjid;
    let number = index + 1;
    if (number > 20) {
      if (milestones[memberjid])
        milestones[memberjid].push("Top 50 member of PVX");
      else milestones[memberjid] = ["Top 50 member of PVX"];
    } else if (number > 10) {
      if (milestones[memberjid])
        milestones[memberjid].push("Top 20 member of PVX");
      else milestones[memberjid] = ["Top 20 member of PVX"];
    } else {
      if (milestones[memberjid])
        milestones[memberjid].push("Top 10 member of PVX");
      else milestones[memberjid] = ["Top 10 member of PVX"];
    }
  });

  const donationRes = await getDonation();
  donationRes.forEach((member) => {
    let memberjid = `91${member.number}@s.whatsapp.net`;
    if (member.amount < 500) {
      if (milestones[memberjid]) milestones[memberjid].push("Donator of PVX");
      else milestones[memberjid] = ["Donator of PVX"];
    } else {
      if (milestones[memberjid])
        milestones[memberjid].push("Super donator of PVX");
      else milestones[memberjid] = ["Super donator of PVX"];
    }
  });

  console.log("Added milestones");
  return milestones;
};
