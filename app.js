const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser());

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

main().then(() => { console.log(`connected to db`) }).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wounderlist');
}

//home route

app.get("/", (req, res) => {
    res.send(`home page`);
});

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
