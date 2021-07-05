const mongoose = require("mongoose");

module.exports =
    mongoose.connect("mongodb+srv://mengjulu:test@cluster.plial.mongodb.net/rabbitDB?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).catch(error => handleError(error));