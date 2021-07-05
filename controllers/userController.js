const Post = require("../models/post");
const Poststate = require("../models/postState");
const Comment = require("../models/comment");
const User = require("../models/user");
const timeAgo = require("node-time-ago");

exports.getProfile = async (req, res) => {

    const findUser = await User.findOne({
        account: req.params.user
    });
    const upvoted = await Poststate.find({
        user: findUser,
        vote: 1
    }).populate({
        path: "post",
        select: "title time",
        populate: {
            path: "user subforum",
            select: "account name"
        }
    });
    const downvoted = await Poststate.find({
        user: findUser,
        vote: -1
    }).populate({
        path: "post",
        select: "title time",
        populate: {
            path: "user subforum",
            select: "account name"
        }
    });
    const saved = await Poststate.find({
        user: findUser,
        saved: true
    }).populate({
        path: "post",
        select: "title subforum time",
        populate: {
            path: "user subforum",
            select: "account name"
        }
    });
    const comment = await Comment.find({
        user: findUser
    }).populate({
        path: "post",
        select: "user title subforum time",
        populate: {
            path: "user subforum",
            select: "account name"
        }
    });
    
    User.findOne({
            account: req.params.user
        })
        .then(user => {
            if (user) {
                Post.find({
                        user: user._id
                    })
                    .populate({
                        path: "user subforum",
                        select: "account name"
                    })
                    .then(post => {
                        res.render("user/profile", {
                            pageTitle: "Profile: " + user.account,
                            timeAgo: timeAgo,
                            findUser: user,
                            post: post,
                            comment: comment,
                            upvoted: upvoted,
                            downvoted: downvoted,
                            saved: saved
                        })
                    })
            } else {
                res.render("user/userError", {
                    pageTitle: "Awww!"
                })
            }
        })
        .catch(err => {
            console.log(err)
        });
};

exports.getSettings = (req, res) => {
    User.findById(req.user._id)
        .then(user => {
            res.render("user/setting", {
                pageTitle: "Settings",
                user: user
            });
        })
        .catch(err => {
            console.log(err)
        })
};