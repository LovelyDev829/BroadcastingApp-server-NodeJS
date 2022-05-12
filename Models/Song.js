const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let songSchema = new Schema({
  authorId: {
    type: String
  },
  authorName:{
    type: String
  },
  songTitle: {
    type: String
  },
  songUrl: {
    type: String
  },
  songTime: {
    type: Number
  },
}, {
    collection: 'ammar_song'
  })

module.exports = mongoose.model('Song', songSchema)