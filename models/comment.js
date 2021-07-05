const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("../config/mongoose");

const commentSchema = new Schema({
    content: String,
    post: {
        type: Schema.Types.ObjectId,
        ref: "post"
    },
    time: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
});

module.exports = mongoose.model("comment", commentSchema);