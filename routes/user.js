const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewear.js");

const controllerUser = require("../controllers/users.js");

router.route("/signup")
    .get((req, res, next) => {
        res.render("./users/signup.ejs");
    })
    .post(wrapAsync(controllerUser.signUp));

router.route("/login")
    .get((req, res) => {
        if (typeof req.query.redirect === "string" && req.query.redirect.startsWith("/") && !req.query.redirect.startsWith("//")) {
            req.session.redirectUrl = req.query.redirect;
        }
        res.render("./users/login.ejs");
    })
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), controllerUser.login);

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have been logged out.");
        res.redirect("/listings");
    });
});

module.exports = router;