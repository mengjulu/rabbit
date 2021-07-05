const User = require("../models/user");
const Poststate = require("../models/postState");
const bcrypt = require("bcrypt");
const app = require("express")();
const flash = require("connect-flash");
app.use(flash());

exports.getLogin = (req, res) => {

    if (req.isUnauthenticated()) {
        res.render("user/auth/login", {
            pageTitle: "Log in",
            message: req.flash("info")
        })
    } else {
        res.redirect("/");
    };
};
exports.getRegister = (req, res) => {

    if (req.isUnauthenticated()) {
        res.render("user/auth/register", {
            pageTitle: "Register",
            message: req.flash("info")
        });
    } else {
        res.redirect("/");
    }
};

exports.getChangePassword = (req, res) => {

    if (req.isAuthenticated()) {
        res.render("user/auth/changePassword", {
            pageTitle: "Change password",
            message: req.flash("info")
        });
    } else {
        res.redirect("/");
    }
};

exports.logOut = (req, res) => {
    req.logout();
    res.redirect("/");
}

exports.changePassword = (req, res) => {
    const loginUser = req.user;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const isValid = bcrypt.compareSync(oldPassword, loginUser.password);
    const saltRounds = 10;
    const hashPassword = bcrypt.hashSync(newPassword, saltRounds);

    if (isValid) {
        if (oldPassword === newPassword) {
            req.flash("info", "Please enter valid password.")
            res.redirect("back");
        }
        User.findById(loginUser._id)
            .then(user => {
                user.password = hashPassword;
                user.save();
                req.flash("info", "Changed successfully!")
                res.redirect("back");
            })
    } else {
        req.flash("info", "Current password does not match!")
        res.redirect("back");
    }
};

exports.deleteAccount = (req, res) => {
    const loginUserId = req.user._id;
   
    Poststate.deleteMany({
        user: loginUserId
    }).exec();

    User.findOneAndDelete({
        _id: loginUserId
    }).exec();

    res.send(true);
};

exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    };
};