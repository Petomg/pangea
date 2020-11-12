let mongoose = require("mongoose");


let TopicSchema = mongoose.Schema({
    name: {
        type: String,
        requried: true,
        dropDups: true
    }
}, 
{

    timestamps: true
    
});


let TopicModel = new mongoose.model('Topic', TopicSchema);

module.exports = TopicModel;