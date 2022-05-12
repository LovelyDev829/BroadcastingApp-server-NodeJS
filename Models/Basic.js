const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let basicSchema = new Schema({
  broadcastingUrl: { type: String },
  resourceUrl: { type: String },

  currentModeId: { type: String },
  currentAuthorId: { type: String },
  currentModePosition: { type: Number },
  currentAuthorPosition: { type: Number },
  modeCount: {type: Number}
}, {
    collection: 'ammar_basic'
  })

module.exports = mongoose.model('Basic', basicSchema)