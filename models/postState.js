const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("../config/mongoose");


const postStateSchema = new Schema({
    user: Schema.Types.ObjectId,
    post: {
        type: Schema.Types.ObjectId,
        ref: "post"
    },
    vote: {
        type: Number,
        min:-1,
        max:1,
        default:0
    },
    saved: {
        type: Boolean
    }
});

module.exports = mongoose.model("postState", postStateSchema);