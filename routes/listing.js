const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");



//  +++++++++   converting joi into middleware  ++++++++
const validateListing = (req, res, next) => {
    console.log(req.body.newList);
    let data = listingSchema.validate(req.body.newList);
    if (!data) {
      throw new ExpressError(400, "errMsg");
    } else {
      next();
    }
  };

// ++++++++++++++++++++  (index route)  ++++++++++++++++
router.get(
    "/",
    wrapAsync(async (req, res) => {
      const allListings = await Listing.find({});
      res.render("listings/index.ejs", { allListings });
    })
  );
  
  // +++++++++++++++++++++ (New route) ++++++++++++++++++++
  router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
  });
  
  // ++++++++++++++++++++   create route  +++++++++++++++++
  router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res, next) => {
      const newListing = new Listing(req.body.newList);
      await newListing.save();
      res.redirect("/listings");
    })
  );
  
  // ++++++++++++++++++++ (show route) ++++++++++++++++++++
  router.get(
    "/:id",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      const h_listing = await Listing.findById(id).populate("reviews");
      res.render("listings/show.ejs", { h_listing });
    })
  );

  // +++++++++++++++++++  (edit route)  ++++++++++++++++++++
router.get(
    "/:id/edit",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      const h_listing = await Listing.findById(id);
      console.log(h_listing);
      res.render("listings/edit.ejs", { h_listing });
    })
  );
  
  // +++++++++++++++++++  (Update route)  ++++++++++++++++++
  router.put(
    "/:id",
    validateListing,
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      await Listing.findByIdAndUpdate(id, { ...req.body.newList });
      res.redirect(`/listings/${id}`);
    })
  );
  
  // +++++++++++++++++++  (Delete route)  ++++++++++++++++++++
  router.delete(
    "/:id",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      let deleted_listing = await Listing.findByIdAndDelete(id);
      console.log(deleted_listing);
      res.redirect("/listings");
    })
  );
  

  module.exports = router;