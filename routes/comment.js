const commentController = require("../controllers/commentController");
const express = require("express");
const router = express.Router();

router.post("/createcomment", commentController.createNewComment);
router.patch("/edit/comment/:commentId", commentController.editComment);
router.delete("/delete/comment/:postId/:commentId", commentController.deleteComment);

module.exports = router;