const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const user_controller = require("../controllers/users");

router
  .route("/register")
  .get(user_controller.registerForm)
  .post(catchAsync(user_controller.registerUser));

router
  .route("/login")
  .get(user_controller.loginForm)
  // Passport does the heavy lifting of determinning if the user's password or username is valid
  // If not valid, we use flash a message stating so, and redirect them to try to login again
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
      keepSessionInfo: true,
    }),
    user_controller.loginUser
  );

router.get("/logout", user_controller.logoutUser);

module.exports = router;
