// let { igApi, getCookie } = require("insta-fetcher");
// require("dotenv").config();
// let ig;
// let isIgSetup = false;

const axios = require("axios");

module.exports.command = () => {
  return { cmd: ["insta", "i", "ig"], handler: handler };
};

const handler = async (bot, msg, msgInfoObj) => {
  let { prefix, args, reply, from } = msgInfoObj;
  if (args.length === 0) {
    reply(`❌ URL is empty! \nSend ${prefix}insta url`);
    return;
  }

  let urlInsta = args[0];
  if (urlInsta.includes("?")) urlInsta = urlInsta.split("/?")[0];
  console.log(urlInsta);

  try {
    let res = await axios.get(
      "https://fantox001-scrappy-api.vercel.app/instadl?url=" + urlInsta
    );

    if (res.data.videoUrl) {
      bot.sendMessage(
        from,
        {
          video: { url: res.data.videoUrl },
        },
        { quoted: msg, mediaUploadTimeoutMs: 1000 * 30 }
      );
    } else {
      reply(
        `❌ There is some problem.\n\nNote: only public insta videos can be downloaded!`
      );
    }
  } catch (err) {
    reply(
      `${err.toString()}\n\nNote: only public insta videos can be downloaded!`
    );
  }
};

// const handler = async (bot, msg, msgInfoObj) => {
//   let { prefix, args, reply } = msgInfoObj;
//   try {
//     if (!isIgSetup) {
//       // const username = process.env.usernameIG;
//       // const password = process.env.passwordIG;
//       // const session_id = await getCookie(username, password);
//       // console.log(session_id);
//       const session_id = process.env.session_id;
//       console.log(session_id);
//       ig = new igApi(session_id);
//       ig.setCookie(session_id);
//       isIgSetup = true;
//     }

//     if (args.length === 0) {
//       reply(`❌ URL is empty! \nSend ${prefix}insta url`);
//       return;
//     }

//     let urlInsta = args[0];

//     // if (
//     //   !(
//     //     urlInsta.includes("instagram.com/p/") ||
//     //     urlInsta.includes("instagram.com/reel/") ||
//     //     urlInsta.includes("instagram.com/tv/")
//     //   )
//     // ) {
//     //   reply(
//     //     `❌ Wrong URL! Only Instagram posted videos, tv and reels can be downloaded.`
//     //   );
//     //   return;
//     // }

//     if (urlInsta.includes("?")) urlInsta = urlInsta.split("/?")[0];
//     console.log(urlInsta);

//     ig.fetchPost(urlInsta)
//       .then((res) => {
//         console.log(res);
//         if (res.media_count == 1) {
//           if (res.links[0].type == "video") {
//             bot.sendMessage(
//               from,
//               {
//                 video: { url: res.links[0].url },
//               },
//               { quoted: msg }
//             );
//           } else if (res.links[0].type == "image") {
//             bot.sendMessage(
//               from,
//               {
//                 image: { url: res.links[0].url },
//               },
//               { quoted: msg }
//             );
//           }
//         } else if (res.media_count > 1) {
//           for (let i = 0; i < res.media_count; i++) {
//             if (res.links[i].type == "video") {
//               bot.sendMessage(
//                 from,
//                 {
//                   video: { url: res.links[i].url },
//                 },
//                 { quoted: msg }
//               );
//             } else if (res.links[i].type == "image") {
//               bot.sendMessage(
//                 from,
//                 {
//                   image: { url: res.links[i].url },
//                 },
//                 { quoted: msg }
//               );
//             }
//           }
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//         reply(err.toString());
//       });
//   } catch (err) {
//     console.log(err);
//     reply(err.toString());
//   }
// };
