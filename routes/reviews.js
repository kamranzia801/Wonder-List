const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isReviewAuthor, validateReview, isLoggedIn } = require("../middlewear.js");

const reviewController = require("../controllers/reviews.js")

//reviews route

router.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.create));

// review delete

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.delete));

module.exports = router;