const User = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("connect-flash");

const strategy = new LocalStrategy({
    passReqToCallback: true
}, 
(req, username, password, done) => {
    const saltRounds = 10;
    const hashPassword = bcrypt.hashSync(password, saltRounds);
    const newUser = new User({
        account: username,
        password: hashPassword
    });

    User.findOne({
        account: {
            "$regex": username,
            "$options": "i"
        }
    }).then((existUser) => {
        if (existUser) {
            return done(null, false, req.flash("info", "Sorry! Account exists."));
        } else {
            newUser.save()
                .then(user => {
                    return done(null, newUser);
                })
        }
    });
});

module.exports = (passport) => {
    passport.use("local-register", strategy);
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};