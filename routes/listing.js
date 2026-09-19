const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner, validateListing } = require("../middlewear.js");

//listing

router.get("/", wrapAsync(async (req, res) => {
    const listings = await listing.find({});
    res.render("listings/index.ejs", { listings });
}));

//delete Route

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = await req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
}));

//New route

router.get("/new", isLoggedIn, wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
}));

//Create New listing

router.post("/", validateListing, isLoggedIn, wrapAsync(async (req, res, next) => {
    const newlisting = new listing(req.body.listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success", "Listing Created Succesfully!");
    res.redirect("/listings");
}));

//show route

router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = await req.params;
    const indlisting = await listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!indlisting) {
        req.flash("error", "This page you requested for doesn't Exist!");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { indlisting });
}));

//edit get route

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = await req.params;
    const indlisting = await listing.findById(id).populate();
    if (!indlisting) {
        req.flash("error", "This page you requested for doesn't Exist!");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { indlisting });
}));

//update route

router.put("/:id", validateListing, isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = await req.params;
    req.flash("success", "Listing Updated Successfully!");
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings${id}`);
}));


module.exports = router;