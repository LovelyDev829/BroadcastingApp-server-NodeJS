const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Author = require('./Author');
const Song = require('./Song');

let modeSchema = new Schema({
  modeName: {
    type: String
  }, 
  authorCount: {
    type: Number
  }, 
  authorList: [{
    _id: false,
    author: {
      type: Schema.Types.ObjectId,
      ref: Author
    }
  }]
}, {
    collection: 'ammar_mode'
})

module.exports = mongoose.model('Mode', modeSchema)