const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    subcomments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comments'}]

},{
    timestamps: true
});

module.exports = mongoose.model("Comments", CommentSchema);