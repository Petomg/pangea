let mongoose = require("mongoose");
let Urn = require('./Urn');
let UrnSchema = mongoose.model('Urn').schema
let Comments = require('./Comments');
let CommentSchema = mongoose.model('Comments').schema


let PostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  topics: {
    type: Array,
    of: String
  },

  upvotes: {
    type: Number,
    min: 0
  },

  // Votacion
  urn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Urn'
  },

  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }],

  author : { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  upvotesUsers : [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
  
},{
  timestamps: true
})


let PostModel = new mongoose.model('Post', PostSchema);

module.exports = PostModel;
