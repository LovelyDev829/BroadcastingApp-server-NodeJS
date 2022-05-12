const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Song = require('./Song');

let authorSchema = new Schema({
  modeId:{
    type: String
  },
  modeName:{
    type: String
  },
  authorName: {
    type: String
  },
  authorPhotoUrl: {
    type: String
  },
  authorLike: {
    type: Number
  },
  songCount: {
    type: Number
  },
  songList: [{
    _id: false,
    song: {
      type: Schema.Types.ObjectId,
      ref: Song
    }
  }]
}, {
    collection: 'ammar_author'
  })

module.exports = mongoose.model('Author', authorSchema)