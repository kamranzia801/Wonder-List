const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const review = require("./models/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main().then(() => { console.log(`connected to db`) }).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wounderlist');
}

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    if (error) {
        let errorMsg = error.details.map((el) => el.message).join(", ")
        throw new ExpressError(400, errorMsg);
    }
    else {
        next();
    }
}

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)
    if (error) {
        let errorMsg = error.details.map((el) => el.message).join(", ")
        throw new ExpressError(400, errorMsg);
    }
    else {
        next();
    }
}

//index route

app.get("/listings", wrapAsync(async (req, res) => {
    const listings = await listing.find({});
    res.render("listings/index.ejs", { listings });
}));

//delete Route

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = await req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//New route

app.get("/listings/new", wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
}));

//Create New listing

app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    const newlisting = new listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");

}));

//show route

app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = await req.params;
    const indlisting = await listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", { indlisting });
}));

//edit get route

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = await req.params;
    const indlisting = await listing.findById(id).populate();
    res.render("./listings/edit.ejs", { indlisting });
}));

//update route

app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = await req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.indlisting });
    res.redirect("/listings");
}));

//reviews route

app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    let listing1 = await listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    await newReview.save();
    listing1.reviews.push(newReview._id);
    await listing1.save();
    res.redirect(`/listings/${req.params.id}`);
}));

// review delete

app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { pull: { review: reviewId } })
    await review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));

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
