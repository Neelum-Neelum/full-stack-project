mapboxgl.accessToken =
    "pk.eyJ1IjoiZGVsdGEtc3R1ZHVlbnQiLCJhIjoiY2xvMDk0MTVhMTJ3ZDJrcGR5ZDFkaHl4ciJ9.Gj2VU1wvxc7rFVt5E4KLOQ";
const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: [...coordinates],
    zoom: 8,
});

const marker = new mapboxgl.Marker({ color: "red" }).setLngLat([...coordinates])
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML("<h1>Welcome to WanderLust!</h1>"))
.addTo(map);