// This will seed the database

const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedDescriptions");
const axios = require("axios");

const dotenv = require("dotenv");
dotenv.config();

// Get geoJSON location
const mapbox_geocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapbox_token = process.env.MAPBOX;
const geoCoder = mapbox_geocoding({ accessToken: mapbox_token });

async function getImage() {
  try {
    const res = await axios.get(
      "https://api.unsplash.com/photos/random?collections=429524&count=1&client_id=XfQifBCISo8pHbUklmol9EmE7YD0fxPuM8_VmybKDpU"
    );
    //console.log("In the getImage()", res.data[0].urls.small);
    return res.data[0].urls.small;
  } catch (error) {
    console.log(error);
  }
}

async function loadImagesForArray() {
  const arr = [];
  for (let i = 0; i < 10; i++) {
    await getImage().then((data) => {
      //console.log("In the loading Images for array", data);
      arr[i] = data;
    });
  }

  return arr;
}

// Connecting to the MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp", {
  useNewURLParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

// This will first delete the contents of the collection,
// then seed for 50 random locations
const seedDB = async () => {
  await Campground.deleteMany({});
  const arr = await loadImagesForArray();

  for (let i = 0; i < 100; i++) {
    const randNum = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[randNum].city}, ${cities[randNum].state}`,
      image: arr[Math.floor(Math.random() * 10)],
      description:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corrupti unde deserunt quae iusto voluptatem asperiores obcaecati quam culpa nobis eos dolor, voluptates numquam reprehenderit, necessitatibus voluptatum animi rerum, dolorum ab.",
      price: price,
      author: "641b2a2b4461d4c344e9aede",
      geometry: {
        type: "Point",
        coordinates: [cities[randNum].longitude, cities[randNum].latitude],
      },
    });
    await camp.save();

    // // Forgot that cities file includes lat, long coordinates already.
    // // But this is how it would be done, if those were not provided.
    // await geoCoder
    //   .forwardGeocode({
    //     query: `${cities[randNum].city}, ${cities[randNum].state}`,
    //     limit: 1,
    //   })
    //   .send()
    //   .then(async (data) => {
    //     camp.geometry = data.body.features[0].geometry;
    //     console.log(data.body.features[0].geometry);
    //     await camp.save();
    //   });
    //console.log(camp);
  }
};

seedDB().then(() => {
  console.log("Seeding complete!");
  db.close();
});
