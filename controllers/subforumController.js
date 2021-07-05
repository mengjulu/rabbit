const Subforum = require("../models/subforum");
const timeAgo = require("node-time-ago");
const User = require("../models/user");

exports.getSubforum = (req, res) => {
    const name = (req.params.subforum).toLowerCase();
    const sort = req.query.sort === "hot" ? { voteNum: -1 } :
    req.query.sort === "new" ? { time: -1 } :
    req.query.sort === "old" ? { time: 1 } :
    { time: -1 };

    Subforum
        .find({
            name: name
        })
        .populate({
            path: "post",
            populate: {
                path: "user poststate",
                select: "id account subscribed saved vote"
            },
            options: {
                sort: sort
            }
        })
        .then(subforum => {
            res.render("subforum/subforumPage", {
                pageTitle: "Rabbit: " + name.toUpperCase(),
                subforum: subforum,
                timeAgo: timeAgo,
                url: req.protocol + "://" + req.get("host"),
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.subscribeSub = (req, res) => {
    const sub = req.params.subforum;
    req.user ?
        User.findById(req.user._id)
        .then(user => {
            if (!user.subscribed.includes(sub)) {
                user.updateOne({
                    $push: {
                        subscribed: sub
                    }
                }).exec();
                res.send("sub");

            } else {
                user.updateOne({
                    $pull: {
                        subscribed: sub
                    }
                }).exec();
                res.send("unsub");
            }
        }) :
        res.send(false);
};