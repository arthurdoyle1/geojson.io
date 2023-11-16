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
                'description':
                    '<strong>Make it Mount Pleasant</strong><p><a href="http://www.mtpleasantdc.com/makeitmtpleasant" target="_blank" title="Opens in a new window">Make it Mount Pleasant</a> is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>',
                'icon': 'theatre'
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [-76.038659, 0]
            }
        },
        {
            'type': 'Feature',
            'properties': {
                'description':
                    '<strong>Make it Mount Pleasant</strong><p>',
                'icon': 'theatre'
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [-75.034659, 0]
            }
        },
        {
            'type': 'Feature',
            'properties': {
                'description':
                    '<strong>Another Place 1</strong><p>Description for Another Place 1.</p>',
                'icon': 'bar'
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [-74.03, 0]
            }
       },
        {
            'type': 'Feature',
            'properties': {
                'description':
                    '<strong>Another night in rome 1</strong><p>Description for Another Place 1.</p>',
                'icon': 'bar'
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [-72.03, 0]
            }            
        },
        {
            'type': 'Feature',
            'properties': {
                'description':
                    '<strong>Another Place 2</strong><p>Description for Another Place 2.</p>',
                'icon': 'bicycle'
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [-73.040, 0]
            }
        },
        // Add more duplicated features as needed
        // ...
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
                'id': layerID,
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

            // Create a popup, but don't add it to the map yet.
            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            })
                .setHTML(feature.properties.description);

            // Add a click event to the layer.
map.on('click', layerID, (e) => {
    const clickedFeature = e.features[0];
    
    // Use the specific description from the clicked feature's properties.
    const description = clickedFeature.properties.description;

    // Populate the popup and set its coordinates based on the feature found.
    popup.setLngLat(clickedFeature.geometry.coordinates)
        .setHTML(description)
        .addTo(map);
            });

            // Add a mouseover event to the layer.
            map.on('mouseover', layerID, (e) => {
                // Change the cursor style as a UI indicator.
                map.getCanvas().style.cursor = 'pointer';
            });

            // Add a mouseout event to the layer.
            map.on('mouseout', layerID, () => {
                // Reset the cursor style when not hovering over a clickable feature.
                map.getCanvas().style.cursor = '';
                popup.remove();
            });
        }
    }
});
