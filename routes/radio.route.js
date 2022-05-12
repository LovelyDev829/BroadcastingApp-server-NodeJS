let mongoose = require("mongoose"),
  express = require("express"),
  router = express.Router();
var moment = require("moment-timezone");
let songSchema = require("../models/Song");
let authorSchema = require("../models/Author");
let modeSchema = require("../models/Mode");
let allSchema = require("../models/All");
let basicSchema = require("../models/Basic");

router.route("/createSong").post((req, res, next) => {
  const { authorName, songTitle, songUrl, songTime } = req.body;
  const newSong = new songSchema({
    songTitle: songTitle,
    songUrl: songUrl,
    songTime: songTime,
  });
  newSong
    .save()
    .then((song) => {
      if (song) {
        authorSchema
          .findOne({ authorName: authorName })
          .then((author) => {
            if (author) {
              let songList = author.songList;
              songList.push({ song: song._id });
              let count = author.songCount?(author.songCount+1):1;
              authorSchema
                .findByIdAndUpdate(
                  author._id,
                  { songList: songList,
                    songCount: count },
                  { new: true }
                )
                .then((updatedAuthor) => {
                  console.log(
                    "[Creation] A  song,   songTitle  : " + songTitle
                  );
                  res.status(200).json({ songTitle: songTitle });
                })
                .catch((err) => console.log(err));
            }
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
});

router.route("/createAuthor").post((req, res, next) => {
  const { modeName, authorName, authorPhotoUrl, authorLike } = req.body;
  const newAuthor = new authorSchema({
    authorName: authorName,
    authorPhotoUrl: authorPhotoUrl,
    authorLike: authorLike,
    songCount: 0
  });
  newAuthor
    .save()
    .then((author) => {
      if (author) {
        // modeSchema.findById(modeName)
        modeSchema
          .findOne({ modeName: modeName })
          .then((mode) => {
            if (mode) {
              let authorList = mode.authorList;
              authorList.push({ author: author._id });
              let count = mode.authorCount? (mode.authorCount + 1):1;
              modeSchema
                .findByIdAndUpdate(
                  mode._id,
                  { authorList: authorList,
                    authorCount: count },
                  { new: true }
                )
                .then((updatedMode) => {
                  console.log(
                    "[Creation] An author, authorName : " + authorName
                  );
                  res.status(200).json({ authorName: authorName });
                })
                .catch((err) => console.log(err));
            }
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
});

router.route("/createMode").post((req, res, next) => {
  const { modeName } = req.body;
  const newMode = new modeSchema({
    modeName: modeName,
    authorCount: 0,
  });
  newMode
    .save()
    .then((mode) => {
      basicSchema.find().then((basic) => {
        let count = basic[0].modeCount?(basic[0].modeCount+1):1;
        basicSchema.findByIdAndUpdate(
          "622b4bab6c7968eb6624ba77",
          { modeCount: count },
          { new: true }
        )
        .then((updatedBasic)=>{
          console.log("[Creation] A  mode  , modeName   : " + modeName);
          res.status(200).json({ modeName: modeName });
        })
        .catch((err)=>console.log(err));
      });
    })
    .catch((err) => console.log(err));
});

router.route("/").get((req, res) => {
  allSchema.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

router.route("/all_structure").get((req, res) => {
  var basic;
  basicSchema.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      basic = data;
    }
  });
  modeSchema
    .find()
    .populate({ path: "authorList.author" })
    // .populate({ path: "authorList.author.songList.song" })
    .then((modeList) => {
      res.status(200).json({ basic, modeList: modeList });
    })
    .catch((err) => console.log(err));
});
var localTime, worldTime, nowHours, nowMinutes, nowSeconds, passedSeconds;
var resultId=1, resultStartingTime=0;
function newAuthorStart() {
  localTime = new Date();
  console.log("LocalTime : " + localTime);
  worldTime = moment().tz("America/Los_Angeles");
  console.log("WorldTime : " + worldTime.format());
  nowHours = moment(worldTime).hours();
  nowMinutes = moment(worldTime).minutes();
  nowSeconds = moment(worldTime).seconds();
  console.log("nowHours : " + nowHours);
  console.log("nowMinutes : " + nowMinutes);
  console.log("nowSeconds : " + nowSeconds);
  passedSeconds = nowHours * 3600 + nowMinutes * 60 + nowSeconds;
  console.log("passedSeconds : " + passedSeconds);
}

async function whichAndWhere(songIdList, nowId, restTime){
  // console.log(songIdList, nowId);
  // console.log(songIdList.length);
  
  var listLength = songIdList.length
  var nowSongTime;
  await songSchema.findById(songIdList[nowId-1])
  .then((songItem)=>{
    nowSongTime=songItem.songTime;
  })
  .then(()=>{
    if(nowSongTime > restTime){
      resultId = nowId;
      resultStartingTime = restTime;
      return {resultId, resultStartingTime};
    }
    else{
      // console.log(nowId+"-------"+nowSongTime+" : "+restTime);
      return whichAndWhere(songIdList, nowId==listLength?1:nowId+1, restTime-nowSongTime)
    }
  })
}

router.route("/stream/:authorId").get((req, res) => {
  console.log(req.params);
  const { authorId } = req.params;
  var songIdList=[];
  newAuthorStart();
  console.log("get-----------------------------------------------------//");
  authorSchema.findById(authorId).then((authorItem) => {
    authorItem.songList.map((songItem) => {
      songIdList.push(songItem.song.valueOf());
    })
  })
  .then(()=>{
    // console.log(songIdList);
    whichAndWhere(songIdList,1,passedSeconds)
    .then(()=>{
      console.log("resultId : "+resultId+",   resultStartingTime : "+resultStartingTime)
      // res.json({resultId,resultStartingTime});
      songSchema.findById(songIdList[resultId-1])
      .then((song)=>{
        var songURL=song.songUrl;
        var songTimE=song.songTime;
        var songTitle = song.songTitle;
        res.json({"songTitle":songTitle, "songUrl":songURL, "songTime":songTimE, "startTime":resultStartingTime});
      })
    })
  })
});

module.exports = router;
