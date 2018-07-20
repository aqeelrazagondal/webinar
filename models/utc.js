
const mongoose = require('mongoose');
const utcSchema = new mongoose.Schema({

  value: {type: String},
  abbr: {type: String},
  offsett: {type: Number},
  isdst: {type: Boolean},
  text: {type: String}

});

const utc = mongoose.model('utc', utcSchema);
module.exports.utc = utc;