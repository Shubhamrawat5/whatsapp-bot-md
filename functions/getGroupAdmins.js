module.exports.getGroupAdmins = (participants) => {
  admins = [];
  for (let memb of participants) {
    memb.admin ? admins.push(memb.id) : "";
  }
  return admins;
};
