const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("../config/mongoose");

const subforumSchema = new Schema({
    name: String,
    description: String,
    imgUrl: String,
    post: [{
        type: Schema.Types.ObjectId,
        ref: "post"
    }]
});

module.exports = mongoose.model("subforum", subforumSchema);