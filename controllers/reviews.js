const listing = require("../models/listing.js");
const review = require("../models/review.js");

module.exports.create = async (req, res) => {
    let listing1 = await listing.findById(req.params.id);
    let newReview = new review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();
    listing1.reviews.push(newReview._id);
    await listing1.save();
    req.flash("success", "Review Created Successfully!");
    res.redirect(`/listings/${req.params.id}`);
}

module.exports.delete = async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully!");
    res.redirect(`/listings/${id}`);
}