if (!sessionStorage.getItem("alert") == true) {
  alert(
    "Thank you for coming to YelpCamp! This is a project website I built from scratch that is supposed to mimic Airbnb, but for the camping world. Please feel free to explore this site and everything it has to offer! I encourage you to register for a 'fake' account, add some campsites to the database, and leave reviews on other campsites. All user passwords are salted and hashed. I am the only one who has access to the database, but please just use some fake data as this a demo. Once again, thank you for checking out YelpCamp! \n                                                                               -Brandon Bisceglia"
  );

  sessionStorage.setItem("alert", true);
}
