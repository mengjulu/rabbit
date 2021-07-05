const Post = require("../models/post");
const Comment = require("../models/comment");

exports.createNewComment = (req, res) => {

    const postId = req.body.postId;
    const account = req.user._id;
    const commentContent = req.body.commentContent;
    const newComment = new Comment({
        post: postId,
        user: account,
        content: commentContent
    });

    newComment.save();
    Post.updateOne({
        _id: postId
    }, {
        $push: {
            comment: newComment._id
        }
    }).exec();
    res.redirect("back");
};

exports.editComment = (req, res) => {

    const commentId = req.params.commentId;
    const changedContent = req.body.changedContent;

    Comment.findById(commentId)
    .then(comment => {
        comment.content = changedContent;
        comment.save();
        res.send(true);
    })
    .catch(err => {
        console.log(err);
    })
};

exports.deleteComment = (req, res) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    Post.updateOne({
        _id: postId
    }, {
        $pull: {
            comment: commentId
        }
    }).exec();

    Comment.deleteOne({
        _id: commentId,
        user: req.user._id
    }).exec();
    
    res.send(true);
};