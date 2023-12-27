const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController =require("../controllers/listing.js");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });


router.route("/")
.get(wrapAsync(listingController.index))
// .post(isLoggedIn, validateListing,
//     wrapAsync(listingController.createListing));
.post(upload.single('h_Listing[image]'),(req, res) => {
    res.send(req.file);
});

// +++++++++++++++++++++ (New route) ++++++++++++++++++++
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner, validateListing,
      wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,
    wrapAsync(listingController.destroyListing));


// +++++++++++++++++++  (edit route)  ++++++++++++++++++++
router.get(
    "/:id/edit", isLoggedIn, isOwner,
    wrapAsync(listingController.renderEditForm));

  module.exports = router;