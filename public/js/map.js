const mapContainer = document.getElementById('map');
const mapToken = mapContainer.dataset.mapToken;
const listingLocation = mapContainer.dataset.location;

mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [77.2090,28.6139 ],
    zoom: 10
});

fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(listingLocation)}.json?access_token=${mapToken}`)
    .then(response => response.json())
    .then(data => {
        const feature = data.features && data.features[0];
        if (!feature) return;

        map.setCenter(feature.center);
        map.setZoom(12);
        new mapboxgl.Marker().setLngLat(feature.center).addTo(map);
    })
    .catch(error => console.error('Mapbox geocoding failed:', error));