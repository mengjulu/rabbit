const mainPageControllers = require("../controllers/mainPageController");
const express = require("express");
const router = express.Router();

router.get("/", mainPageControllers.fetchAllPost);
router.get("/?sort=:sort", mainPageControllers.fetchAllPost);
router.get("/search", mainPageControllers.searchResult);
router.post("/search", mainPageControllers.search);

module.exports = router;