
mapboxgl.accessToken = 'pk.eyJ1IjoiYXJ0ZG95MyIsImEiOiJjbG96bWhmZzQwMXNoMmxxdmVqc2c2ZWRmIn0._PxpDHic5ZbhSndCkiVzIg';
// This GeoJSON contains features that include an "icon"
// property. The value of the "icon" property corresponds
// to an image in the Mapbox Light style's sprite. (Note:
// the name of images is the value of the "icon" property
// + "-15".)
const places = {
    'type': 'FeatureCollection',
    'features': [
        {
            'type': 'Feature',
            'properties': {
                'icon': 'music'
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [-77.031706, 38.914581]
            }
        },
        {
            'type': 'Feature',
            'properties': {
                'icon': 'music'
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [-77.020945, 38.878241]
            }
        },
        {
            'type': 'Feature',
            'properties': {
                'icon': 'music'
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [-77.007481, 38.876516]
            }
        }
    ]
};

const filterGroup = document.getElementById('filter-group');
const map = new mapboxgl.Map({
    container: 'map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-77.04, 38.907],
    zoom: 11.15
});

map.on('load', () => {
    // Add a GeoJSON source containing place coordinates and information.
    map.addSource('places', {
        'type': 'geojson',
        'data': places
    });

    for (const feature of places.features) {
        const symbol = feature.properties.icon;
        const layerID = `poi-${symbol}`;

        // Add a layer for this symbol type if it hasn't been added already.
        if (!map.getLayer(layerID)) {
            map.addLayer({
                'id': 'places',
                'type': 'symbol',
                'source': 'places',
                'layout': {
                    // These icons are a part of the Mapbox Light style.
                    // To view all images available in a Mapbox style, open
                    // the style in Mapbox Studio and click the "Images" tab.
                    // To add a new image to the style at runtime see
                    // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
                    'icon-image': `${symbol}`,
                    'icon-allow-overlap': true
                },
                'filter': ['==', 'icon', symbol]
            });
            
            // When a click event occurs on a feature in the places layer, open a popup at the
            // location of the feature, with description HTML from its properties.
            map.on('click', 'places', (e) => {
            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const description = e.features[0].properties.description;

              // Ensure that if the map is zoomed out such that multiple
              // copies of the feature are visible, the popup appears
              // over the copy being pointed to.
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(description)
              .addTo(map);
              });

              // Change the cursor to a pointer when the mouse is over the places layer.
              map.on('mouseenter', 'places', () => {
              map.getCanvas().style.cursor = 'pointer';
              });

              // Change it back to a pointer when it leaves.
              map.on('mouseleave', 'places', () => {
              map.getCanvas().style.cursor = '';
              });

            // Add checkbox and label elements for the layer.
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = layerID;
            input.checked = true;
            filterGroup.appendChild(input);

            const label = document.createElement('label');
            label.setAttribute('for', layerID);
            label.textContent = symbol;
            filterGroup.appendChild(label);

            // When the checkbox changes, update the visibility of the layer.
            input.addEventListener('change', (e) => {
                map.setLayoutProperty(
                    layerID,
                    'visibility',
                    e.target.checked ? 'visible' : 'none'
                );
            });
        }
    }
});
