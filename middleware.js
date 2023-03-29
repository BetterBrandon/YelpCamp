const { campgroundSchema } = require("./schema_validator");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");

// This middleware will protect routes where the user has to be logged in
module.exports.isLoggedIn = (request, response, next) => {
  // Passport saves the serialized session information,
  // Here it will fill out the deserailized format
  //console.log("Request.User -> ", request.user);
  if (!request.isAuthenticated()) {
    // This will save the
    request.session.returnUrl = request.originalUrl;
    request.flash("error", "You must be signed in!");
    return response.redirect("/login");
  }

  next();
};

module.exports.rememberUrl = (request, response, next) => {
  request.session.returnUrl = request.originalUrl;

  next();
};

module.exports.isAuthor = async (request, response, next) => {
  const { id } = request.params;
  //Check if the current logged in user, is the owner of the campground
  const campground = await Campground.findById(id);
  if (!campground.author.equals(request.user._id)) {
    request.flash("error", "You do not have permission for this!");
    return response.redirect(`/campgrounds/${id}`);
  }

  next();
};

module.exports.isReviewAuthor = async (request, response, next) => {
  const { id, reviewId } = request.params;
  //Check if the current logged in user, is the owner of the campground
  const review = await Review.findById(reviewId);
  if (!review.author.equals(request.user._id)) {
    request.flash("error", "You do not have permission for this!");
    return response.redirect(`/campgrounds/${id}`);
  }

  next();
};

module.exports.validateCampground = (request, response, next) => {
  const { error } = campgroundSchema.validate(request.body);
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
