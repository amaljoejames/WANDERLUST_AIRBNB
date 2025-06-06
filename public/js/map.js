mapboxgl.accessToken = window.maptoken;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: window.listing.geometry.coordinates,
  zoom: 8.5
});

map.addControl(new mapboxgl.NavigationControl());
map.scrollZoom.disable();

map.on('style.load', () => {
  map.setFog({}); // Default atmosphere

  map.loadImage(
    'https://docs.mapbox.com/mapbox-gl-js/assets/cat.png',
    (error, image) => {
      if (error) throw error;

      map.addImage('cat', image);

      map.addSource('cat-point', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [window.listing.geometry.coordinates[0] + 0.05, window.listing.geometry.coordinates[1]] // offset a bit
              }
            }
          ]
        }
      });

      map.addLayer({
        id: 'cat-layer',
        type: 'symbol',
        source: 'cat-point',
        layout: {
          'icon-image': 'cat',
          'icon-size': 0.25
        }
      });

      // Add click event to show popup on cat click
      map.on('click', 'cat-layer', (e) => {
        new mapboxgl.Popup({ offset: 25 })
          .setLngLat(e.features[0].geometry.coordinates)
          .setHTML(`<h6>${window.listing.title}</h6><p>Exact location provided after booking</p>`)
          .addTo(map);
      });

      // Change cursor to pointer when hovering the cat icon
      map.on('mouseenter', 'cat-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'cat-layer', () => {
        map.getCanvas().style.cursor = '';
      });
    }
  );
});

// 🌍 Globe spinning
const secondsPerRevolution = 240;
const maxSpinZoom = 5;
const slowSpinZoom = 3;

let userInteracting = false;
const spinEnabled = true;

function spinGlobe() {
  const zoom = map.getZoom();
  if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
    let distancePerSecond = 360 / secondsPerRevolution;
    if (zoom > slowSpinZoom) {
      const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
      distancePerSecond *= zoomDif;
    }
    const center = map.getCenter();
    center.lng -= distancePerSecond;
    map.easeTo({ center, duration: 1000, easing: (n) => n });
  }
}

map.on('mousedown', () => userInteracting = true);
map.on('dragstart', () => userInteracting = true);
map.on('moveend', () => {
  userInteracting = false;
  spinGlobe();
});

spinGlobe();


