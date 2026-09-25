if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
    // console.log(process.env.SECRET);
}

const dbUrl = process.env.ATLAS_DB_URL;

const express = require("express");
const app = express();
const dns = require("dns");
dns.setServers(["1.1.1.1", "0.0.0.0"]);
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser());

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("error in mongo session store", err);
})

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true,
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.userStatus = req.user;
    res.locals.currentUrl = req.originalUrl;
    res.locals.search = req.query.search || "";
    next();
})

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

main().then(() => { console.log(`connected to db`) }).catch(err => console.log(err));

async function main() {
    mongoose.connect(dbUrl).then(() => { console.log("success") }).catch((err) => { console.log("error", err) })
}

//home route

// app.get("/", (req, res) => {
//     res.send(`home page`);
// });

//for initialize localhost

app.listen(8080, (req, res) => {
    console.log(`app listening to 8080`);
})

//middle wear for if page route does not exist

app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

//middle wear

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong!" } = err;
    if (res.headersSent) {
        return next(err);
    }
    res.status(statusCode).render("error.ejs", { message });
});
