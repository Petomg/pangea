let mongoose = require("mongoose");
let Urn = require('./Urn');
let UrnSchema = mongoose.model('Urn').schema
let Comment = require('./Comments');
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

  // TODO: Agregar Comentarios
  // Votacion
  urn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Urn'
  },

  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]


  
  
},{
  timestamps: true
})


let PostModel = new mongoose.model('Post', PostSchema);

module.exports = PostModel;
