const listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //redirect url
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be loggedin before Creating listing!")
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }else{
        res.locals.redirectUrl = "/listings"
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let { id } = await req.params;
    let listing = await listing.findById(id);
    if (userStatus && !listing.owner._id.equals(userStatus._id)) {
        req.flash("error", "you don't have prmission to edit this listing!");
        return res.redirect(`/listings${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    if (error) {
        let errorMsg = error.details.map((el) => el.message).join(", ")
        throw new ExpressError(400, errorMsg);
    }
    else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)
    if (error) {
        let errorMsg = error.details.map((el) => el.message).join(", ")
        throw new ExpressError(400, errorMsg);
    }
    else {
        next();
    }
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id, reviewId } = await req.params;
    let review = await Review.findById(reviewId);
    if (userStatus && !review.author._id.equals(userStatus._id)) {
        req.flash("error", "you don't have prmission to delete this review!");
        return res.redirect(`/listings${id}`);
    }
    next();
}