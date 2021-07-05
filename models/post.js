const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("../config/mongoose");

const postSchema = new Schema({
    subforum: {
        type: Schema.Types.ObjectId,
        ref: "subforum"
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    url: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now,
        required: true
    },
    comment: [{
        type: Schema.Types.ObjectId,
        ref: "comment"
    }],
    voteNum: {
        type: Number,
        default: 0
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    poststate: [{
        type: Schema.Types.ObjectId,
        ref: "postState"
    }]
});

module.exports = mongoose.model("post", postSchema);