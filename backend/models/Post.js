let mongoose = require("mongoose");


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
  }

  // TODO: Agregar Comentarios
  // Votacion

},{
  timestamps: true
})


let PostModel = new mongoose.model('Post', PostSchema);

module.exports = PostModel;
