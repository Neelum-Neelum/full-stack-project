const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

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
    let response = await geocodingClient.forwardGeocode({
      query:  req.body.newList.location,
      limit: 1
  })
      .send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.newList);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;
    console.log(newListing);
    let savedListing = await newListing.save();
    console.log(savedListing);
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
      return res.redirect("/listings");
    }
    let originalImageUrl = h_listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { h_listing, originalImageUrl});
  };

  // Update route
  module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.newList });

    if(typeof req.file != "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
    req.flash("success", "listing Updated!");
    res.redirect(`/listings/${id}`);
  };

  // Delete route
  module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deleted_listing = await Listing.findByIdAndDelete(id);
    console.log(deleted_listing);
    req.flash("success", "Listing Deleted successfully!");
    res.redirect("/listings");
  };