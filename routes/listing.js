const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");

//Validator

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

//listing

router.get("/", wrapAsync(async (req, res) => {
    const listings = await listing.find({});
    res.render("listings/index.ejs", { listings });
}));

//delete Route

router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = await req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//New route

router.get("/new", wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
}));

//Create New listing

router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    const newlisting = new listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");

}));

//show route

router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = await req.params;
    const indlisting = await listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs", { indlisting });
}));

//edit get route

router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = await req.params;
    const indlisting = await listing.findById(id).populate();
    res.render("./listings/edit.ejs", { indlisting });
}));

//update route

router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = await req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.indlisting });
    res.redirect("/listings");
}));


module.exports = router;