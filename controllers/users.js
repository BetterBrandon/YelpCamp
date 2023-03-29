const User = require("../models/user");

module.exports.registerForm = (request, response) => {
  response.render("user/register");
};

module.exports.registerUser = async (request, response, next) => {
  try {
    const { email, username, password } = request.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    // Once a user is created, automatically log them in
    request.login(registeredUser, (err) => {
      if (err) return next(err);
      request.flash("success", "Welcome to YelpCamp!");
      response.redirect("/campgrounds");
    });
  } catch (error) {
    request.flash("error", error.message);
    response.redirect("/register");
  }
};

module.exports.loginForm = (request, response) => {
  response.render("user/login");
};

module.exports.loginUser = (request, response) => {
  request.flash("success", "Welcome Back!");
  const redirectUrl = request.session.returnUrl || "/campgrounds";
  // console.log(request.session.returnUrl);
  // console.log(redirectUrl);
  delete request.session.returnUrl;
  response.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};
