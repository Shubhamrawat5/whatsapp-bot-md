const axios = require("axios");

//return object {message:"", info:""} =>
//message having score and info having extra info about game like inning over, game over etc
//INFO KEY: "MO" when match over, "IO" when inning over, "ER" when error
module.exports.getCricketScore = async (matchID) => {
  let obj = {};
  try {
    let { data } = await axios.get(
      "https://testing-nine-theta.vercel.app/score?url=https://www.cricbuzz.com/live-cricket-scores/" +
        matchID
    );

    let title = data.title;
    title = title.slice(0, title.search(","));
    let score = data.current;
    let runrate = data.runrate;
    let lastwicket = data.lastwicket;
    let recentballs = data.recentballs;
    let currentBatsman = data.batsman.slice(0, -1);
    let bowler = data.bowler;
    let bowlerover = data.bowlerover;
    let bowlerruns = data.bowlerruns;
    let bowlerwickets = data.bowlerwickets;
    if (recentballs === "Data Not Found") recentballs = data.lastwicket;

    let d = await axios.get(
      "https://cricket-scorecard-2021.herokuapp.com/scorecard/" + matchID
    );
    data = d.data;

    let batsman1 = "out ho gaya",
      batsman2 = "out ho gaya";
    let currentInning;
    let alt = true;
    let firstInningRuns, firstInningTeam;
    let update = data["result"]["update"];
    let message = "";

    let isMatchStarted = false;
    if (Object.keys(data.Innings1[2]).length !== 0) isMatchStarted = true;
    if (!isMatchStarted) {
      //title and update only
      message += `*${title}*\n`;
      message += `\n${update}`;
      obj.message = message;
      return obj;
    }

    if (Object.keys(data.Innings2[2]).length === 0) {
      currentInning = "Innings1";
    } else {
      currentInning = "Innings2";
      firstInningRuns = data.Innings1[2].runs + "/" + data.Innings1[2].wickets;
      firstInningTeam = data.Innings1[2].team
        .match(/(\b\S)?/g)
        .join("")
        .toUpperCase();
      if (firstInningTeam.length <= 1) firstInningTeam = data.Innings1[2].team;
    }

    let isInningOver = false;

    //inning over or not
    if (update === "innings break") {
      obj.info = "IO";
      isInningOver = true;
    }

    //find playing 2 batsman
    data[currentInning][0]["Batsman"].forEach((batsman) => {
      if (batsman.dismissal === "batting") {
        if (alt) {
          let batsmanName = batsman.name;
          if (batsmanName.search(/\(/) !== -1) {
            batsmanName = batsmanName.slice(0, batsmanName.search(/\(/) - 1);
          }
          batsmanName += batsmanName === currentBatsman ? "*" : ""; //add * to playing batmsan
          batsman1 = `${batsmanName}: ${batsman.runs} (${batsman.balls})`;
          alt = false;
        } else {
          let batsmanName = batsman.name;
          if (batsmanName.search(/\(/) !== -1) {
            batsmanName = batsmanName.slice(0, batsmanName.search(/\(/) - 1);
          }
          batsmanName += batsmanName === currentBatsman ? "*" : ""; //add * to playing batmsan
          batsman2 = `${batsmanName}: ${batsman.runs} (${batsman.balls})`;
        }
      }
    });

    //is match over?
    if (data["result"]["winning_team"] !== "Not Completed") {
      obj.info = "MO";
    }

    if (batsman1 === batsman2) batsman1 = batsman2 = "";

    /* MESSAGE :-
    Royal Challengers Bangalore vs Chennai Super Kings

    RCB - 156/6
    CSK - 19/0 (2.1) CRR:  8.77

    🏏 Ruturaj Gaikwad: 11 (7)
    🏏 Faf du Plessis: 11 (11)

    ⚾ Mohammed Siraj* 9-0 (1.1)

    recent balls
    ... 0 1 4 1 1 | 0 6 L1 1 2 0 | 1
    Last Wicket: example 22 (20) 
    chennai super kings need 134 runs
    */

    //title
    message += `*${title}*\n`;

    //first inning info
    message += firstInningRuns
      ? `\n${firstInningTeam + " - " + firstInningRuns}`
      : "";

    //current inning info
    message += `\n${score} ${runrate}`;

    //bowler and last wicket info | isInningOver (when inning over) - "out of gya" , "data not found" comes!
    message +=
      isInningOver || obj.info === "MO"
        ? ""
        : `\n\n🏏 ${batsman1} \n🏏 ${batsman2}\n
⚾ ${bowler} ${bowlerruns}-${bowlerwickets} (${bowlerover})
${batsman2 === "out ho gaya" ? "\nLast Wicket: " + lastwicket + "\n" : ""}
_recent balls_ \n${recentballs}`;

    //match update
    message +=
      currentInning === "Innings2" || isInningOver ? `\n\n${update}` : "";

    obj.message = message;
  } catch (err) {
    console.log(err);
    obj.message = "";
    obj.info = "ER";
  }
  return obj;
};
