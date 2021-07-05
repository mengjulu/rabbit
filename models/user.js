const mongoose = require("mongoose");
const Schema = mongoose.Schema;

require("../config/mongoose");

const userSchema = new Schema({
    account: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    subscribed: [{
        type: Schema.Types.String,
        ref: "subforum"
    }],
    createDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("user", userSchema);