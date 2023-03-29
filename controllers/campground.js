const Campground = require("../models/campground");
const mapbox_geocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapbox_token = process.env.MAPBOX;
const geoCoder = mapbox_geocoding({ accessToken: mapbox_token });

module.exports.index = async (request, response) => {
  const campgrounds = await Campground.find({});
  response.render("campgrounds/index", { campgrounds });
};

module.exports.createNewForm = (request, response) => {
  response.render("campgrounds/new");
};

module.exports.createCampground = async (request, response) => {
  // This is how we get the GeoJSON from the user's campsite location
  geoCoder
    .forwardGeocode({
      query: request.body.campground.location,
      limit: 1,
    })
    .send()
    .then(async (data) => {
      const campground = new Campground(request.body.campground);
      campground.geometry = data.body.features[0].geometry;
      campground.author = request.user._id;
      console.log(campground);
      await campground.save();

      // Flash a message once we have created the campround, then redirect
      request.flash("success", "Succesfully made a new campground!");
      return response.redirect(`/campgrounds/${campground._id}`);
    });
  // Simple validaitng logic that doesn't handle everything. Just here to be acknowledged
  // if (!request.body.campground) {
  //   throw new ExpressError("Invalid Campground Data", 400);
  // }
};

module.exports.showCampground = async (request, response) => {
  const campground = await Campground.findById(request.params.id)
    // Populate the reviews for the selected campground, then populate the authors for those reviews
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");

  if (!campground) {
    request.flash("error", "Cannot find that campground!");
    return response.redirect("/campgrounds");
  }
  response.render("campgrounds/show", { campground });
};

module.exports.updateForm = async (request, response) => {
  const campground = await Campground.findById(request.params.id);
  if (!campground) {
    request.flash("error", "Cannot find that campground!");
    return response.redirect("/campgrounds");
  }
  response.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (request, response) => {
  const { id } = request.params;

  const camp = await Campground.findByIdAndUpdate(id, {
    ...request.body.campground,
  });
  request.flash("success", "Succesfully updated Campground!");
  response.redirect(`/campgrounds/${camp.id}`);
};

module.exports.delete = async (request, response) => {
  const { id } = request.params;
  await Campground.findByIdAndDelete(id);
  response.redirect("/campgrounds");
};
