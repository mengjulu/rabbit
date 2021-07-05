const subforumControllers = require("../controllers/subforumController");
const postControllers = require("../controllers/postController");
const submitControllers = require("../controllers/submitController");
const authController = require("../controllers/authController");
const express = require("express");
const router = express.Router();

router.get("/create", authController.isAuth, submitControllers.getCreateSubforumPage);
router.get("/:subforum", subforumControllers.getSubforum);
router.get("/:subforum/create/post", authController.isAuth, submitControllers.getCreatePostPage);
router.get("/:subforum/create/link", authController.isAuth, submitControllers.getCreateLinkPage);
router.get("/:subforum/?sort=:sort", subforumControllers.getSubforum);
router.get("/:subforum/:postname", postControllers.fetchPost);
router.get("/:subforum/:postname/?sort=:sort", postControllers.fetchPost);

router.post("/create/subforum", submitControllers.createSubforum);
router.put("/:subforum/subscribe", subforumControllers.subscribeSub);

module.exports = router;