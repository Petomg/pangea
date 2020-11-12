let mongoose = require("mongoose");
let Urn = require('./Urn');
let UrnSchema = mongoose.model('Urn').schema


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
  }
  
},{
  timestamps: true
})


let PostModel = new mongoose.model('Post', PostSchema);

module.exports = PostModel;
