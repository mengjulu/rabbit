const User = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("connect-flash");

const strategy = new LocalStrategy({
    passReqToCallback: true
}, (req, username, password, done) => {
    User.findOne({
        account: {
            "$regex": username,
            "$options": "i"
        }
    }).then((user) => {
        if (!user) {
            return done(null, false, req.flash("info", "Sorry! Account wasn't found."));
        }
        const isValid = bcrypt.compareSync(password, user.password);

        if (isValid) {
            return done(null, user);
        }
        return done(null, false, req.flash("info", "Oops! Wrong password."));
    });
});


module.exports = (passport) => {
    passport.use("local-login", strategy);
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};