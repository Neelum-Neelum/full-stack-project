const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// app.get("/testListing", async (req,res) => {
//     let sampleListing = new listing({
//         title: "My new villa",
//         description: "By the beech",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("sucessful testing");
// });

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

//  +++++++++   converting joi into middleware  ++++++++
const validateListing = (req, res, next) => {
  console.log(req.body.newList);
  let data = listingSchema.listingSchema.validate(req.body.newList);
  if (!data) {
    throw new ExpressError(400, "errMsg");
  } else {
    next();
  }
};

//  ++++++++++++++    Joi middleware for review +++++++++++ 
const validateReview = (req, res, next) => {
    console.log(req.body.newList);
    let data = reviewSchema.validate(req.body.newList);
    if (!data) {
      throw new ExpressError(400, "errMsg");
    } else {
      next();
    }
  };

// ++++++++++++++++++++  (index route)  ++++++++++++++++
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// +++++++++++++++++++++ (New route) ++++++++++++++++++++
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// ++++++++++++++++++++   create route  +++++++++++++++++
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.newList);
    await newListing.save();
    res.redirect("/listings");
  })
);

// ++++++++++++++++++++ (show route) ++++++++++++++++++++
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const h_listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { h_listing });
  })
);

// +++++++++++++++++++  (edit route)  ++++++++++++++++++++
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const h_listing = await Listing.findById(id);
    console.log(h_listing);
    res.render("listings/edit.ejs", { h_listing });
  })
);

// +++++++++++++++++++  (Update route)  ++++++++++++++++++
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.newList });
    res.redirect(`/listings/${id}`);
  })
);

// +++++++++++++++++++  (Delete route)  ++++++++++++++++++++
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleted_listing = await Listing.findByIdAndDelete(id);
    console.log(deleted_listing);
    res.redirect("/listings");
  })
);

// ++++++++++++++++++ Reviews(Post route)  ++++++++++++++++++
app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`);
}));

//  ++++++++++++++  Reviews(delete route)  ++++++++++++++++++
app.delete("/listings/:id/reviews/:reviewID", wrapAsync(async (req, res) => {
  let {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
}));

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// ++++++++++++++++++++   Middleware   +++++++++++++++++++++
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("port is listening to port 8080");
});