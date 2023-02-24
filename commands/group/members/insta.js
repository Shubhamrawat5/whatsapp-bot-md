let { igApi, getCookie } = require("insta-fetcher");
require("dotenv").config();
let ig;
let isIgSetup = false;

module.exports.command = () => {
  return { cmd: ["insta", "i"], handler: handler };
};

const handler = async (bot, msg, from, msgInfoObj) => {
  if (!isIgSetup) {
    const username = process.env.username;
    const password = process.env.password;

    const session_id = await getCookie(username, password);
    ig = new igApi(session_id);
    isIgSetup = true;
  }
  let { prefix, args, reply } = msgInfoObj;

  if (args.length === 0) {
    reply(`❌ URL is empty! \nSend ${prefix}insta url`);
    return;
  }

  let urlInsta = args[0];

  // if (
  //   !(
  //     urlInsta.includes("instagram.com/p/") ||
  //     urlInsta.includes("instagram.com/reel/") ||
  //     urlInsta.includes("instagram.com/tv/")
  //   )
  // ) {
  //   reply(
  //     `❌ Wrong URL! Only Instagram posted videos, tv and reels can be downloaded.`
  //   );
  //   return;
  // }

  if (urlInsta.includes("?")) urlInsta = urlInsta.split("/?")[0];
  console.log(urlInsta);

  ig.fetchPost(urlInsta)
    .then((res) => {
      if (res.media_count == 1) {
        if (res.links[0].type == "video") {
          bot.sendMessage(
            from,
            {
              video: { url: res.links[0].url },
            },
            { quoted: msg }
          );
        } else if (res.links[0].type == "image") {
          bot.sendMessage(
            from,
            {
              image: { url: res.links[0].url },
            },
            { quoted: msg }
          );
        }
      } else if (res.media_count > 1) {
        for (let i = 0; i < res.media_count; i++) {
          if (res.links[i].type == "video") {
            bot.sendMessage(
              from,
              {
                video: { url: res.links[i].url },
              },
              { quoted: msg }
            );
          } else if (res.links[i].type == "image") {
            bot.sendMessage(
              from,
              {
                image: { url: res.links[i].url },
              },
              { quoted: msg }
            );
          }
        }
      }
    })
    .catch((err) => {
      console.log(err);
      reply(err.toString());
    });
};
