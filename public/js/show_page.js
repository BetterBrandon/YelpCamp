mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: c.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
  .setLngLat(c.geometry.coordinates)
  // Can add a popup window to the marker
  // .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${c.title}</h3>`))
  .addTo(map);
