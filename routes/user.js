const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router.get("/settings", authController.isAuth, userController.getSettings);
router.get("/:user", userController.getProfile);

router.delete("/delete/account/:loginUser", authController.deleteAccount);

module.exports = router;