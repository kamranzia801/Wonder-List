const express = require("express");
const router = express.Router({ mergeParams: true });
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const review = require("../models/review.js");
const { isReviewAuthor, validateReview, isLoggedIn } = require("../middlewear.js");


//reviews route

router.post("/", validateReview, isLoggedIn, wrapAsync(async (req, res) => {
    let listing1 = await listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();
    listing1.reviews.push(newReview._id);
    await listing1.save();
    req.flash("success", "Review Created Successfully!");
    res.redirect(`/listings/${req.params.id}`);
}));

// review delete

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully!");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;