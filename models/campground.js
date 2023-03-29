const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const options = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
  {
    title: String,
    price: Number,
    description: String,
    location: String,
    // This is to store our location in a GeoJSON format
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    image: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  options
);

// This creates a virtual type that can be referecned from the model, used for the cluster map.
// This won't be stored in the DB
CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `<a href="/campgrounds/${this._id}">${this.title}</a>`;
});

CampgroundSchema.post("findOneAndDelete", async function (campground) {
  console.log("here at the reviews area");
  if (campground) {
    await Review.deleteMany({
      _id: {
        $in: campground.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
