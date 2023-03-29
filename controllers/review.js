const Review = require("../models/review");
const Campground = require("../models/campground");

module.exports.createReview = async (request, response) => {
  const campground = await Campground.findById(request.params.id);
  const review = new Review(request.body.review);
  review.author = request.user._id;
  campground.reviews.push(review);
  await campground.save();
  await review.save();
  request.flash("success", "Succesfully added review!");
  response.redirect(`/campgrounds/${campground.id}`);
};

module.exports.deleteReview = async (request, response) => {
  const { id, reviewId } = request.params;
  // The "$pull" pulls out a reviewId that we want to delete from the array of reviews
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  request.flash("success", "Succesfully deleted review!");
  response.redirect(`/campgrounds/${id}`);
};
