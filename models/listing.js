const mongoose= require("mongoose");
const Schema = mongoose.Schema;

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

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;