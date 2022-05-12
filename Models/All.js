const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let allSchema = new Schema({
  currentMode: {type: Number},
  currentAuthor: {type: Number},
  currentSong: {type: Number},
  currentTime: {type: Number},
  volume: {type: Number},
  modeCount: {type: Number},
  broadcastingDomain: {type: String},
  modeList: {
    modeId: {type: Number},
    modeName: {type: String},
    authorCount: {type: Number},
    authorList: {
      authorId: {type: Number},
      authorName: {type: String},
      authorImage: {type: String},
      authorLike: {type: Number},
      songCount: {type: Number},
      songList:{
        songId: {type: Number},
        songTitle: {type: String},
        songUrl: {type: String},
      }
    }
  }


  // modeName: { type: String },
  // authorName: {type: String},
  // songTitle: { type: String},
  // songUrl: { type: String },
}, {
    collection: 'ammar'
  })

module.exports = mongoose.model('All', allSchema)