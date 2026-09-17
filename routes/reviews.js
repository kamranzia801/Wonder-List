const express = require("express");
const router = express.Router({ mergeParams: true });
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const review = require("../models/review.js");

//reviews

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

//reviews route

router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing1 = await listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    await newReview.save();
    listing1.reviews.push(newReview._id);
    await listing1.save();
    req.flash("success","Review Created Successfully!");
    res.redirect(`/listings/${req.params.id}`);
}));

// review delete

router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;