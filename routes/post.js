const postControllers = require("../controllers/postController");
const submitControllers = require("../controllers/submitController");
const authController = require("../controllers/authController");
const express = require("express");
const router = express.Router();

router.get("/create/post", authController.isAuth, submitControllers.getCreatePostPage);
router.get("/create/link", authController.isAuth, submitControllers.getCreateLinkPage);
router.get("/r/:subforum/:postname/editpost", postControllers.getEditPost);
router.get("/r/:subforum/:postname/editlink", postControllers.getEditLink);
router.post("/create/link", authController.isAuth, submitControllers.createLink);
router.post("/create/post", authController.isAuth, submitControllers.createPost);
router.post("/r/:subforum/:postname/editpost", authController.isAuth, postControllers.editPost);
router.post("/r/:subforum/:postname/editlink", authController.isAuth, postControllers.editLink);
router.post("/:postId/save", postControllers.savePost);
router.post("/:postId/:vote", postControllers.votePost);
router.post("/delete/post/:subforum/:postId", authController.isAuth, postControllers.deletePost);

module.exports = router;