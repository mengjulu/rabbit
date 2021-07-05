const Post = require("../models/post");
const Subforum = require("../models/subforum");
const timeAgo = require("node-time-ago");

exports.fetchAllPost = async (req, res) => {

    const sub = await Subforum.find();
    const user = req.user ? req.user._id : null;
    const sort = req.query.sort === "hot" ? {voteNum: -1} :
    req.query.sort === "new" ? { time: -1 } :
    req.query.sort === "old" ? { time: 1 } :
    { time: -1 };
    const post = await Post.find()
        .sort(sort)
        .populate({
            path: "poststate",
            match: {
                user: user
            },
            select: "saved vote"
        })
        .populate("subforum")
        .populate("user");

    res.render("mainPage/mainPage", {
        pageTitle: "Rabbit",
        posts: post,
        timeAgo: timeAgo,
        subforum: sub,
        url: req.protocol + "://" + req.get("host"),
    })
};

exports.search = (req, res) => {
    const mainPageSearch = req.body.search;
    res.redirect("/search?q=" + mainPageSearch);
};

exports.searchResult = (req, res) => {
    const searchKey = req.query.q;

    Post.find({
            $or: [{
                    title: {
                        "$regex": searchKey,
                        "$options": "i"
                    }
                },
                {
                    content: {
                        "$regex": searchKey,
                        "$options": "i"
                    }
                }
            ]
        })
        .sort({
            time: -1
        })
        .populate("subforum")
        .populate("user")
        .populate({
            path: "poststate",
            match: {
                user: req.user
            },
            select: "saved vote"
        })
        .then(posts => {
            res.render("searchResult", {
                pageTitle: "Search Result: " + searchKey,
                searchKey: searchKey,
                posts: posts,
                timeAgo: timeAgo,
                url: req.protocol + "://" + req.get("host")
            })
            .catch((err) => {
                console.log(err);
            })
        });
};