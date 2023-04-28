# YelpCamp

## Purpose of Project

While at college, I took a Web Development class as an upper-level elective. I enjoyed that class, and I wanted to get more experience in the full-stack field. Thus, I took the Web Developer Bootcamp course on Udemy. I got to learn and experience how the front and back end come together to create a fully responsive web experience.

## Implementation

---

YelpCamp is driven by **Node.js** to handle the backend functionality of the app. **Express** is the web framework used for managing the **RESTful** routes. Full **CRUD** implementation is supported to persist user, campground, and review data in the **MongoDB** database. To input data into the database, **Mongoose** is utilized to help create object modeling schemas for MongoDB. **Joi** helps validate backend data when users create and edit campgrounds or reviews.

**EJS** is the templating engine used to generate the HTML markup. The front end is styled and made responsive with **Bootstrap**, which also handles minor client-side validation for user, campground, and review data. I also got to test and add in **MapBox**, which allowed me to learn a little about geocoding. You can utilize the cluster map that is on the main Campgrounds page to get a visualization of where the campgrounds are located.

Finally, the part I was most unfamiliar with was how do I host and deploy the app. Sure enough, that was explained while also reading the **Heroku** docs, which is where the site is hosted at. Once the app was deployed, I had this very ecstatic feeling. Knowing that my project is on the internet, even if it is just a demo personal project, was mind-blowing.

### Thank you for taking the time to read about YelpCamp, and feel free to explore the website and everything it has to offer! You can visit the site [here](https://boiling-reef-77260.herokuapp.com/).

## Installation

---

Clone the repo if you wish.

Run: `npm install`

Then: `npm start`

Connect to `localhost:3000` to run the server
