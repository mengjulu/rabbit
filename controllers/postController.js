const Post = require("../models/post");
const Poststate = require("../models/postState");
const User = require("../models/user");
const Comment = require("../models/comment");
const Subforum = require("../models/subforum");
const timeAgo = require("node-time-ago");

exports.fetchPost = async (req, res) => {

    const title = req.params.postname;
    const poststate = req.user ? await Poststate.find({
        user: req.user._id
    }) : null;
    const sort = req.query.sort === "hot" ? {voteNum: -1} :
    req.query.sort === "new" ? { time: -1 } :
    req.query.sort === "old" ? { time: 1 } :
    { time: -1 };

    Post.find({
            title: title
        })
        .populate("user")
        .populate("subforum")
        .populate({
            path: "comment",
            populate: {
                path: "user",
                select: "account"
            },
            options: {
                sort: sort
            }
        })
        .populate({
            path: "poststate",
            match: {
                user: req.user
            },
            select: "saved vote"
        })
        .then(post => {
            res.render("post/postPage", {
                pageTitle: "Rabbit: " + title,
                posts: post,
                timeAgo: timeAgo,
                poststate: poststate,
                url: req.protocol + "://" + req.get("host"),
            })
        })
        .catch(err => {
            console.log(err);
        })
};

//edit post/link 
exports.getEditPost = (req, res) => {
    const title = req.params.postname;

    Post.find({
            title: title
        }, ["title", "content"])
        .populate({
            path: "subforum",
            select: "name"
        })
        .then(post => {
            res.render("post/editPost", {
                pageTitle: "Edit",
                posts: post
            })
        })
        .catch(err => {
            console.log(err);
        })
};
exports.getEditLink = (req, res) => {

    const title = req.params.postname;
    Post.find({
            title: title
        }, ["title", "url"])
        .populate({
            path: "subforum",
            select: "name"
        })
        .then(post => {
            res.render("post/editLink", {
                pageTitle: "Edit",
                posts: post
            })
        })
        .catch(err => {
            console.log(err);
        })
};

exports.editPost = async (req, res) => {
    const sub = req.body.subforum;
    const subName = await Subforum.findById(sub);
    const title = req.body.title;
    const content = req.body.content;
    Post.findOne({
            subforum: sub,
            title: title,
            user: req.user._id
        })
        .then(post => {
            post.content = content;
            post.time = Date.now();
            post.save();
        })
        .catch(err => {
            console.log(err);
        })

    res.redirect(`/r/${subName.name}/${title}`);

};

exports.editLink = async (req, res) => {
    const sub = req.body.subforum;
    const subName = await Subforum.findById(sub);
    const title = req.body.title;
    const url = req.body.url;

    Post.findOne({
            subforum: sub,
            title: title,
            user: req.user._id
        })
        .then(post =>{
            post.url = url,
            post.time = Date.now();
            post.save();
        })
        .catch(err => {
            console.log(err);
        })
        res.redirect(`/r/${subName.name}/${title}`);
};

exports.deletePost = (req, res) => {
    const subName = req.params.subforum;
    const postId = req.params.postId;
    Subforum
        .where({
            name: subName
        })
        .updateOne({
            $pull: {
                post: postId
            }
        }).exec();

    User
        .where({
            _id: req.user._id
        })
        .updateOne({
            $pull: {
                post: postId
            }
        }).exec();

    Poststate.deleteMany({
        post: postId
    }).exec();

    Comment.deleteMany({
        post: postId
    }).exec();

    Post.deleteOne({
        _id: postId,
        user: req.user._id
    }).exec();

    res.send(true);
};

exports.savePost = (req, res) => {
    const postId = req.params.postId;
    const loginUser = req.user;

    const newPostState = new Poststate({
        user: loginUser?._id,
        post: postId,
        saved: true
    });
    if (!loginUser) {
        res.send("login");
    } else {
        Poststate
            .findOne({
                user: loginUser._id,
                post: postId
            })
            .then(postState => {
                if (postState) {
                    const savedStatus = postState.saved;
                    postState.saved = !savedStatus;
                    postState.save();
                    res.send(postState.saved);
                } else {
                    newPostState.save();
                    Post
                        .where({
                            _id: postId
                        })
                        .updateOne({
                            $push: {
                                poststate: newPostState._id
                            }
                        }).exec();
                    res.send(newPostState.saved);
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
};

exports.votePost = async (req, res) => {
    const loginUser = req.user;
    const postId = req.params.postId;
    const vote = req.params.vote;
    const voteNum = vote === "upvote" ? 1 : -1;
    const post = await Post.findById(postId);

    const newPostState = new Poststate({
        user: loginUser?._id,
        post: postId,
        vote: voteNum
    });
    
    let voteSet;
    let voteNumSet;

    if (!loginUser) {
        res.send(false);
    } else {
        Poststate.findOne({
                user: loginUser._id,
                post: postId
            })
            .then(poststate => {
                if (!poststate) {
                    newPostState.save();

                    post.poststate.push(newPostState._id);
                    post.voteNum = post.voteNum + newPostState.vote;
                    post.save();

                    res.send({
                        voteNum: post.voteNum,
                        voteNumSet: newPostState.vote
                    });
                } else {
                    const voteStatus = poststate.vote;
                    switch (vote) {
                        case "upvote":
                            voteSet = voteStatus <= 0 ? 1 : 0;
                            voteNumSet = voteStatus === -1 ? 2 :
                                voteStatus === 1 ? -1 :
                                1;
                            break;
                        case "downvote":
                            voteSet = voteStatus >= 0 ? -1 : 0;
                            voteNumSet = voteStatus === 1 ? -2 :
                                voteStatus === -1 ? 1 :
                                -1;
                            break;
                    };
                    poststate.vote = voteSet;
                    poststate.save();
                    post.voteNum = post.voteNum + voteNumSet;
                    post.save();
                    res.send({
                        voteNum: post.voteNum,
                        voteNumSet: voteNumSet
                    });
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
};