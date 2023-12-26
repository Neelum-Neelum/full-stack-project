const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  };

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs")};

// show listing
module.exports.showListing = (async (req, res) => {
    let { id } = req.params;
    const h_listing = await Listing.findById(id)
    .populate({path: "reviews", populate: {path: "author"}})
    .populate("owner");
    if(!h_listing){
      req.flash("error", "listing you requested for does not exist");
      res.redirect("/listings");
    }
    console.log(h_listing);
    res.render("listings/show.ejs", { h_listing });
  });
 
  // index route
  module.exports.createListing = async (req, res, next) => {
    const newListing = new Listing(req.body.newList);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
  };

  // edit route
  module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const h_listing = await Listing.findById(id);
    console.log(h_listing);
    if(!h_listing){
      req.flash("error", "listing you requested for does not exist");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { h_listing });
  };

  // Update route
  module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.newList });
    req.flash("success", "listing Updated!");
    return res.redirect(`/listings/${id}`);
  };

  // Delete route
  module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deleted_listing = await Listing.findByIdAndDelete(id);
    console.log(deleted_listing);
    req.flash("success", "Listing Deleted successfully!");
    res.redirect("/listings");
  };