const authController = require("../controllers/authController");
const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../config/local-login")(passport);
require("../config/local-register")(passport);

router.get("/register", authController.getRegister);
router.get("/login", authController.getLogin);
router.get("/changePassword", authController.getChangePassword);
router.get("/logout", authController.logOut);

router.post("/register",
    passport.authenticate("local-register", {
        successRedirect: "/",
        failureRedirect: "/register",
        failureFlash: true
    }));
    
router.post("/login",
    passport.authenticate("local-login", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    }));
router.post("/change-password", authController.changePassword);

module.exports = router;