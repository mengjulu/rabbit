const Subforum = require("../models/subforum");
const Post = require("../models/post");

//create subforum
exports.getCreateSubforumPage = (req, res) => {
    if (!req.user) res.redirect("/login");
    res.render("subforum/createSubforum", {
        pageTitle: "create new subforum",
        message: req.flash("info"),
        alert: req.flash("alert")
    });
};

exports.createSubforum = (req, res) => {
    const name = (req.body.subName).toLowerCase();
    const description = req.body.description;
    const maxSize = 1024 * 1024;
    const imgUrl = "/static/image/subImage/" + req.file?.filename;
    const newSubforum = new Subforum({
        name: name,
        description: description,
        imgUrl: imgUrl
    });

    Subforum.exists({
            name: name
        })
        .then((sub) => {
            if (sub) {
                req.flash("info", "The subforum has already exists.");
                res.redirect("back");
            } else if (!req.file) {
                req.flash("alert", "File type is limited to jpg, jpeg, svg and png.");
                res.redirect("back");
            } else if (req.file.size > maxSize) {
                req.flash("alert", "File size is limited to 1MB");
                res.redirect("back");
            }else if (req.file && !sub) {
                newSubforum.save();
                res.redirect(`/r/${name}`);
            }
        })
        .catch(err => {
            console.log(err)
        });
};

//create post
exports.getCreatePostPage = (req, res) => {
    const currentSub = req.params.subforum;

    Subforum.find()
        .then(sub => {
            if (!req.user) res.redirect("/login");
            res.render("post/createPost", {
                pageTitle: "Create a new post",
                subforum: sub,
                path: currentSub,
                message: req.flash("info")
            })
        })
        .catch(err => {
            console.log(err)
        });
};

exports.createPost = async (req, res) => {
    const subforum = req.body.subforum;
    const title = req.body.title;
    const content = req.body.content;
    const user = req.user._id;

    const postexist = await Post.exists({
        title: {
            "$regex": /^title$/i
        },
        subforum: subforum
    });
    const post = new Post({
        subforum: subforum,
        title: title,
        content: content,
        user: user
    });

    if (!postexist) {
        post.save();
        Subforum.findById(subforum)
            .then(sub => {
                sub.post.push(post._id);
                sub.save();
                res.redirect(`/r/${sub.name}/${title}`);
            })
            .catch(err => {
                console.log(err);
            });
    } else {
        req.flash("info", "The title has already existed.");
        res.redirect("back");
    }
};

//create link
exports.getCreateLinkPage = (req, res) => {
    const currentSub = req.params.subforum;

    Subforum.find()
        .then(sub => {
            if (!req.user) res.redirect("/login");
            res.render("post/createLink", {
                pageTitle: "Create a new link",
                subforum: sub,
                path: currentSub,
                message: req.flash("info")
            })
        })
        .catch(err => {
            console.log(err)
        });
};

exports.createLink = async (req, res, next) => {
    const subforum = req.body.subforum;
    const title = req.body.title;
    const url = req.body.url;
    const user = req.user._id;
    const postexist = await Post.exists({
        title: {
            "$regex": /^title$/i
        },
        subforum: subforum
    });
    const post = new Post({
        subforum: subforum,
        title: title,
        url: url,
        user: user
    });

    if (!postexist) {
        post.save();
        Subforum.findById(subforum)
            .then(sub => {
                sub.post.push(post._id);
                sub.save();
                res.redirect(`/r/${sub.name}/${title}`);
            })
            .catch(err => {
                console.log(err);
            });
    } else {
        req.flash("info", "The title has already existed.");
        res.redirect("back");
    }
};