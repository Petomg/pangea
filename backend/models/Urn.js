let mongoose = require("mongoose");


let UrnSchema = mongoose.Schema({
  posVotes: {
    type: Number,
    required: true,
    min: 0
  },

  posUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],

  negVotes: {
    type: Number,
    required: true,
    min: 0
  },

  negUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],

  isClosed: {
    type: Boolean,
    required: true,
  },

},{
  timestamps: true
})


let UrnModel = new mongoose.model('Urn', UrnSchema);

module.exports = UrnModel;
