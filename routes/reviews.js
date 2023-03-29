const express = require("express");
// Since we are getting the id of the campground in our route from app.js, we need that id
// Merge params allows us to use that id in a different route file
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { reviewSchema } = require("../schema_validator");
const Review = require("../models/review");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const review_controller = require("../controllers/review");

const validateReview = (request, response, next) => {
  const { error } = reviewSchema.validate(request.body);
  if (error) {
    // When recieving the error details, it is an array which could have mulitple errors
    // This will join them together
    const message = error.details.map((el) => el.message).join(",");
    throw new ExpressError(message, 400);
  } else {
    // If no validation errors, next needs to be called so that we can proceed
    next();
  }
};

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(review_controller.createReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(review_controller.deleteReview)
);

module.exports = router;
