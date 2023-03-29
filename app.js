if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const mongoStore = require("connect-mongo");

const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");

const User = require("./models/user");

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp";

// Connecting to the MongoDB
mongoose.connect(dbUrl, {
  useNewURLParser: true,
  useUnifiedTopology: true,
});

// Establish a connection to the database, address if there are any errors
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// Stating that we will be using "EJS"
// Letting EJS know where the views folder will be located
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

//MethodOverride is for handling other http routes like POST, DELETE, etc...
app.use(methodOverride("_method"));

// Letting express know where the static css and js files will be located
app.use(express.static(path.join(__dirname, "public")));

// Middleware to enable flash messages
app.use(flash());

// This is will limit mongo injections using keys like $ and .
app.use(mongoSanitize());

// "Helmet helps you secure your Express apps by setting various HTTP headers."
// Helps handle additional securtiy measures
app.use(helmet({ crossOriginEmbedderPolicy: false }));

const scriptSrcUrls = [
  "https://api.mapbox.com/",
  "https://cdn.jsdelivr.net/",
  "https://api.tiles.mapbox.com/",
];

const styleSrcUrls = ["https://api.mapbox.com/", "https://cdn.jsdelivr.net/"];

const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
app.use(
  // Setting the contentSecurityPolicy will allow our app to only retrieve data or scripts from trusted sources
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: ["'self'", "blob:", "data:", "https://images.unsplash.com/"],
      fontSrc: ["'self'"],
      mediaSrc: ["https://dm0qx8t0i9gc9.cloudfront.net/"],
    },
  })
);

const secret = process.env.SECRET || "secret_key";

// Detailing how we want cookies to be saved
const sessionConfig = {
  store: mongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
  }),

  name: "session",
  secret,
  // Session warnings to go away
  resave: false,
  saveUninitialized: true,
  //Options for handling the cookie
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

// Middleware to get passport login started and working
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to handle the if there is any flash messages availabe
// And these will be available on every route
app.use((request, response, next) => {
  response.locals.success = request.flash("success");
  response.locals.error = request.flash("error");
  // If there is a user logged in or not
  response.locals.currentUser = request.user;
  next();
});

// Routes being used for the app
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// app.get("/fakeUser", async (request, response) => {
//   const user = new User({ email: "fake@aol.com", username: "brandon" });
//   const newUser = await User.register(user, "monkey");
//   response.send(newUser);
// });

app.get("/", (request, response) => {
  response.render("home");
});

// This will only run if none of the routes were hit above
app.all("*", (req, res, next) => {
  // This will go to the error handler since we use next()
  next(new ExpressError("Page Not Found", 404));
});

// Error handling
app.use((err, request, response, next) => {
  // If any of the middleware encounters an error, calling next() will have them resolved here
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "An error occured!";
  response.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening to YelpCamp on port ${port}`);
});
