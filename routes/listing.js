const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middlewear.js");
const listingController = require("../controllers/listings.js")

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })

//listing
//Create New listing

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(validateListing, isLoggedIn, upload.single('listing[image]'), wrapAsync(listingController.create))

//New route

router.get("/new", isLoggedIn, wrapAsync(listingController.new));

//show route
//update route
//delete Route

router.route("/:id")
    .get(wrapAsync(listingController.show))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.update))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete));

//edit get route

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editGet));


module.exports = router;