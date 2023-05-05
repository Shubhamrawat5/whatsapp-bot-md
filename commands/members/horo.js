const axios = require("axios");

const getHoro = async (name) => {
  try {
    // let url = `https://aztro.sameerkumar.website/?sign=${name}&day=today`;
    let url = `	https://us-central1-tf-natal.cloudfunctions.net/horoscopeapi_test`;

    let { data } = await axios.post(url, null, {
      params: {
        sign: name,
        date: "today",
        token: "mmEUtLATc8w_UNnHuR2",
      },
    });
    let horoText = `*Horo:* ${name.toUpperCase()}
*Date:* ${data.current_date}
*Lucky Number:* ${data.lucky_number}
*Lucky Time:* ${data.lucky_time}
*Color:* ${data.color}
*Mood:* ${data.mood}
*Description:* ${data.description}`;

    // let horoText = `Current Date: ${data.current_date}
    // Compatibility: ${data.compatibility}
    // Lucky Number: ${data.lucky_number}
    // Lucky Time: ${data.lucky_time}
    // Color: ${data.color}
    // Date Range: ${data.date_range}
    // Mood: ${data.mood}
    // Description: ${data.description}`;

    return horoText;
  } catch (err) {
    console.log(err);
    return err.toString();
  }
};

module.exports.command = () => {
  return { cmd: ["horo", "horoscope"], handler: handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  let { prefix, reply, args } = msgInfoObj;

  if (args.length === 0) {
    let message = `❌ Name is not given! \nSend ${prefix}horo name`;
    await reply(message);
    return;
  }

  let name = args[0].toLowerCase();
  const horos = [
    "aries",
    "taurus",
    "gemini",
    "cancer",
    "leo",
    "virgo",
    "libra",
    "scorpio",
    "sagittarius",
    "capricorn",
    "aquarius",
    "pisces",
  ];

  if (!horos.includes(name)) {
    let message = `❌ Wrong horo name given! \nSend ${prefix}horo name\n\nHoro List: ${JSON.stringify(
      horos
    )}`;
    await reply(message);
    return;
  }
  let text = await getHoro(name);
  await reply(text);
};

// const test = async () => {
//   let text = await getHoro("aries");
//   console.log(text);
// };

// test();
