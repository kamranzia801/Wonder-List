const User = require("../models/user.js");

module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username })
        let regUser = await User.register(newUser, password);
        req.login(regUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wounder List");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");

    }
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to Wounder List");
    res.redirect(res.locals.redirectUrl || "/listings");
};