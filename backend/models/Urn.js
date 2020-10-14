let mongoose = require("mongoose");


let UrnSchema = mongoose.Schema({
  posVotes: {
    type: Number,
    required: true,
    min: 0
  },

  negVotes: {
    type: Number,
    required: true,
    min: 0
  },

  isClosed: {
    type: Boolean,
    required: true,
  },

},{
  timestamps: true
})


let UrnModel = new mongoose.model('Urn', UrnSchema);

module.exports = UrnModel;
