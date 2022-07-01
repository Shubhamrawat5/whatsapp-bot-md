const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const fs = require("fs");
module.exports.command = () => {
  let cmd = ["insta", "i"];

  return { cmd, handler };
};

const axios = require("axios");

const getInstaVideo = async (url) => {
  let imgDirectLink = "",
    videoDirectLink = "",
    error = "";
  try {
    if (url.includes("?")) url = url.slice(0, url.search("\\?"));
    const res = await axios.get(url + "?__a=1&__d=dis", {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        cookie:
          "ig_did=305179C0-CE28-4DCD-847A-2F28A98B7DBF; ig_nrcb=1; mid=YQBN3wAEAAGfSSDsZYS9nf2a5MHO; fbm_124024574287414=base_domain=.instagram.com; csrftoken=4f5QNVgM7ioSEf7nfJFf3WJiZU7oR3Gz",
        pragma: "no-cache",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "Windows",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "user-agent":
          "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
    });
    // console.log(res.data.items[0]);

    if (res.status == 200 && res.data.items[0].video_versions) {
      videoDirectLink = res.data.items[0].video_versions[0].url;
    }
    imgDirectLink = res.data.items[0].image_versions2.candidates[0].url;

    if (res.status == 200 && res.data.graphql.shortcode_media.is_video) {
      videoDirectLink = res.data.graphql.shortcode_media.video_url;
    }
    imgDirectLink = res.data.graphql.shortcode_media.display_url;
  } catch (err) {
    console.log(err);
    error = err.toString();
  }
  // console.log({ imgDirectLink, videoDirectLink, error });
  return { imgDirectLink, videoDirectLink, error };
};

// getInstaVideo("https://www.instagram.com/p/CV7guhtM1R2/");
// getInstaVideo(  "https://www.instagram.com/reel/CbIOewkJXFB/?igshid=YmMyMTA2M2Y=");
// getInstaVideo("https://www.instagram.com/reel/CaUqEQal22W/");

/* ------------------------------------ INSTA -----------------------------------  */
const saveInstaVideo = async (randomName, videoDirectLink) => {
  const response = await axios({
    url: videoDirectLink,
    method: "GET",
    responseType: "stream",
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,/;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
      "cache-control": "max-age=0",
      "sec-ch-ua":
        '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
      "sec-ch-ua-mobile": "?1",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
    },
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
  });

  const path = `./${randomName}`;
  const writer = fs.createWriteStream(path);
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix, reply } = msgInfoObj;

  if (args.length === 0) {
    reply(`❌ URL is empty! \nSend ${prefix}insta url`);
    return;
  }
  let urlInsta = args[0];
  try {
    console.log("Video downloading ->", urlInsta);
    // console.log("Trying saving", urlInsta);
    let { imgDirectLink, videoDirectLink, error } = await getInstaVideo(
      urlInsta
    );
    if (videoDirectLink) {
      let randomName = getRandom(".mp4");
      await saveInstaVideo(randomName, videoDirectLink);
      let stats = fs.statSync(`./${randomName}`);
      let fileSizeInBytes = stats.size;
      // Convert the file size to megabytes (optional)
      let fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
      console.log("Video downloaded ! Size: " + fileSizeInMegabytes);

      //  { caption: "hello there!", mimetype: Mimetype.mp4 }
      // quoted: mek for tagged
      if (fileSizeInMegabytes <= 40) {
        sock.sendMessage(
          from,
          {
            video: fs.readFileSync(`./${randomName}`),
          },
          { quoted: msg }
        );
      } else {
        reply(`❌ File size bigger than 40mb.`);
      }
      fs.unlinkSync(`./${randomName}`);
    } else if (imgDirectLink) {
      await conn.sendMessage(from, { url: imgDirectLink }, MessageType.image, {
        quoted: mek,
      });
    } else {
      reply(error);
    }
  } catch (err) {
    console.log(err);
    reply(err.toString());

    // sock.sendMessage(
    //   from,
    //   {
    //     text: `❌ There is some problem. Also stories and private account media can't be downloaded.`,
    //   },
    //   { quoted: msg }
    // );
  }
};
