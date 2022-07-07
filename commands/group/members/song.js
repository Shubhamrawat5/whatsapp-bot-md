const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const axios = require("axios");
const fs = require("fs");

module.exports.command = () => {
  let cmd = ["song"];

  return { cmd, handler };
};

const getRandom = (ext) => {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
};

const downloadSong = async (randomName, query) => {
  try {
    const INFO_URL = "https://slider.kz/vk_auth.php?q=";
    const DOWNLOAD_URL = "https://slider.kz/download/";
    let { data } = await axios.get(INFO_URL + query);

    if (data["audios"][""].length <= 1) {
      console.log("==[ SONG NOT FOUND! ]==");
      return "NOT";
    }

    //avoid remix,revisited,mix
    let i = 0;
    let track = data["audios"][""][i];
    while (/remix|revisited|mix/i.test(track.tit_art)) {
      i += 1;
      track = data["audios"][""][i];
    }
    //if reach the end then select the first song
    if (!track) {
      track = data["audios"][""][0];
    }

    let link = DOWNLOAD_URL + track.id + "/";
    link = link + track.duration + "/";
    link = link + track.url + "/";
    link = link + track.tit_art + ".mp3" + "?extra=";
    link = link + track.extra;
    link = encodeURI(link); //to replace unescaped characters from link

    let songName = track.tit_art;
    songName =
      songName =
      songName =
        songName.replace(/\?|<|>|\*|"|:|\||\/|\\/g, ""); //removing special characters which are not allowed in file name
    // console.log(link);
    // download(songName, link);
    const res = await axios({
      method: "GET",
      url: link,
      responseType: "stream",
    });
    data = res.data;
    const path = `./${randomName}`;
    const writer = fs.createWriteStream(path);
    data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on("finish", () => resolve(songName));
      writer.on("error", () => reject);
    });
  } catch (err) {
    console.log(err);
    return "ERROR";
  }
};

const handler = async (sock, msg, from, args, msgInfoObj) => {
  let { prefix, reply } = msgInfoObj;

  if (args.length === 0) {
    reply(`❌ Query is empty! \nSend ${prefix}song query`);
    return;
  }
  let randomName = getRandom(".mp3");
  let query = args.join("%20");
  let response = await downloadSong(randomName, query);
  if (response == "NOT") {
    reply(
      `❌ Song not found!\nTry to put correct spelling of song along with singer name.\n[Better use ${prefix}yta command to download correct song from youtube]`
    );
    return;
  }
  console.log(`song saved-> ./${randomName}`, response);

  sock.sendMessage(
    from,
    {
      document: fs.readFileSync(`./${randomName}`),
      fileName: response + ".mp3",
      mimetype: "audio/mpeg",
    },
    { quoted: msg }
  );
  fs.unlinkSync(`./${randomName}`);
};
