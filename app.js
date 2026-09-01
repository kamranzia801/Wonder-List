const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

main().then(() => { console.log(`connected to db`) }).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wounderlist');
}

//index route

app.get("/listings", async (req, res) => {
    const listings = await listing.find({});
    res.render("./listings/index.ejs", { listings });
});

//delete Route

app.delete("/listings/:id", async (req, res) => {
    let { id } = await req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

//New route

app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//Create New listing

app.post("/listings", async (req, res) => {
    // let {title,description,image,price,location,country} = req.body;
    const newlisting = new listing(req.body.listing);
    newlisting.save().then((result) => { console.log(`saved to db`) })
    res.redirect("/listings");
});

//show route

app.get("/listings/:id", async (req, res) => {
    let { id } = await req.params;
    const indlisting = await listing.findById(id);
    res.render("./listings/show.ejs", { indlisting });
});

//edit get route

app.get("/listings/:id/edit", async (req, res) => {
    let { id } = await req.params;
    const indlisting = await listing.findById(id);
    res.render("./listings/edit.ejs", { indlisting });
})

//update route

app.put("/listings/:id", async (req, res) => {
    let { id } = await req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
});


app.get("/", (req, res) => {
    res.send(`home page`);
});

app.listen(8080, (req, res) => {
    console.log(`app listening to 8080`);
})
