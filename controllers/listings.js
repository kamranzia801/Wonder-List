const listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const listings = await listing.find({});
    res.render("listings/index.ejs", { listings });
}

module.exports.new = async (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.create = async (req, res, next) => {
    let url = req.file.path
    let filename = req.file.filename
    const newlisting = new listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = { filename, url }
    await newlisting.save();
    req.flash("success", "Listing Created Succesfully!");
    res.redirect("/listings");
}

module.exports.show = async (req, res) => {
    let { id } = await req.params;
    const indlisting = await listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!indlisting) {
        req.flash("error", "This page you requested for doesn't Exist!");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { indlisting });
}

module.exports.editGet = async (req, res) => {
    let { id } = await req.params;
    const indlisting = await listing.findById(id).populate();
    if (!indlisting) {
        req.flash("error", "This page you requested for doesn't Exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = indlisting.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("./listings/edit.ejs", { indlisting , originalImageUrl });
}

module.exports.update = async (req, res) => {
    let { id } = await req.params;
    let listing = await listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
        let url = req.file.path
        let filename = req.file.filename
        listing.image = { filename, url }
        await listing.save();
    }
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings${id}`);
}

module.exports.delete = async (req, res) => {
    let { id } = await req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
}