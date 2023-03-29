const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campground_controller = require("../controllers/campground");

router
  .route("/")
  .get(catchAsync(campground_controller.index)) // Show all available campgrounds
  .post(
    // Post route on sending new campground
    isLoggedIn,
    validateCampground,
    catchAsync(campground_controller.createCampground)
  );

// Helper route to create new campground
router.get("/new", isLoggedIn, campground_controller.createNewForm);

router
  .route("/:id")
  .get(catchAsync(campground_controller.showCampground)) // Show route for a campground
  .put(
    // The put route that actually updates the individual campground
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(campground_controller.updateCampground)
  )
  .delete(
    // Delete route for a campground
    isLoggedIn,
    isAuthor,
    catchAsync(campground_controller.delete)
  );

// Helper route for updating a campground
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campground_controller.updateForm)
);

module.exports = router;
