const mongoose= require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema= new Schema({
   title: {
      type: String,
      required: true,
   },
   description: String,
   image: {
      type: String,
      default: "https://5.imimg.com/data5/SELLER/Default/2023/4/302835432/MK/JY/XP/3966979/residential-bunglow.jpg",
      set: (v) => v == "" ? "https://5.imimg.com/data5/SELLER/Default/2023/4/302835432/MK/JY/XP/3966979/residential-bunglow.jpg" : v,
   },
   price: Number,
   location: String,
   country: String,
   reviews: [
      {
         type: Schema.Types.ObjectId,
         ref: "Review",
      }
   ]
});

listingSchema.post("findOneAndDelete", async(listing) => {
   if(listing){
      await Review.deleteMany({_id: {$in: listing.reviews}});
   }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;