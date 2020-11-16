let mongoose = require("mongoose");
let uniqueValidator = require('mongoose-unique-validator');

let TopicSchema = mongoose.Schema({
    name: {
        type: String,
        requried: true,
        unique: true
    }
}, 
{

    timestamps: true
    
});

TopicSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser único'
});

let TopicModel = new mongoose.model('Topic', TopicSchema);

module.exports = TopicModel;