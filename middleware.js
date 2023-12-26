const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing");
        return res.redirect("/login");
      }
      next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// module.exports.isOwner = async(req, res, next) =>{
//   let { id } = req.params;
//       let listing = await Listing.findById(id);
//       if(!listing.owner._id.equals(res.locals.currUser._id)){
//         req.flash("error", "you are not the owner of this listing");
//         res.redirect(`/listings/${id}`);
//       }
//       next();
// };

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};


//  +++++++++   converting joi into middleware  ++++++++
module.exports.validateListing = (req, res, next) => {
  console.log(req.body.newList);
  let data = listingSchema.validate(req.body.newList);
  if (!data) {
    throw new ExpressError(400, "errMsg");
  } else {
    next();
  }
};


//  ++++++++++++++    Joi middleware for review +++++++++++ 
module.exports.validateReview = (req, res, next) => {
  console.log(req.body.newList);
  let data = reviewSchema.validate(req.body.newList);
  if (!data) {
    throw new ExpressError(400, "errMsg");
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not the author of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};