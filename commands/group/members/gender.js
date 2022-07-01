const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const axios = require("axios");

const getGender = async (name) => {
  try {
    let url = "https://api.genderize.io/?name=" + name;
    let { data } = await axios.get(url);
    let genderText = `${data.name} is ${data.gender} with ${data.probability} probability`;
    return genderText;
  } catch (err) {
    console.log(err);
    return err.toString();
  }
};

module.exports.command = () => {
  return { cmd: ["gender"], handler: handler };
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix, reply } = msgInfoObj;

  if (args.length === 0) {
    let message = `❌ Name is not given! \nSend ${prefix}gender firstname`;
    reply(message);
    return;
  }
  let namePerson = args[0];
  if (namePerson.includes("@")) {
    let message = `❌ Don't tag! \nSend ${prefix}gender firstname`;
    reply(message);
    return;
  }
  let text = await getGender(namePerson);
  reply(text);
};
