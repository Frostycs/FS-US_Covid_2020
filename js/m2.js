// Constants

// Grade Constant for Proportional Symbol
const grades = [100, 1000, 10000, 100000], // Number of cases
  colors =
  ['rgb(255,255,178)','rgb(254,204,92)','rgb(253,141,60)','rgb(227,26,28)'],
  radii = [5, 15, 30, 70];

// Legend
const legend = id('legend');

// Source of data at the bottom of legend
const source =
    '<p id="data-source" style="text-align: right; font-size:10pt">Source: ' +
    '<a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e8781240' +
    '18b8/live/us-counties.csv">' +
    'The New York Times</a></p>';

// Base Map
mapboxgl.accessToken =
  'pk.eyJ1IjoiZnJvc3R5Y3MiLCJhIjoiY2xkc2cwNGV2MWJjaDNucHJwbmZrMWp1aCJ9.3YXlm7pDCStLj3LTTnm_fQ';
let map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  // Coordinates: 47.32090380789914, -119.84222648774258
  center: [-119.84, 47.32], // starting position [lng, lat]
  zoom: 7, // starting zoom
  projection: 'albers' // projection type
});

map.on('load', () => {
  // County Borders
  map.addSource('counties', {
    type: 'geojson',
    data: 'assets/us-covid-2020-rates.json'
  })
  map.addLayer({
    'id': 'county-borders',
    'type': 'line',
    'source': 'counties'
  })

  // Proportional Symbol Layer
  map.addSource('cases', {
    type: 'geojson',
    data: 'assets/us-covid-2020-counts.json'
  });
  map.addLayer({
    'id': 'case-point',
    'type': 'circle',
    'source': 'cases',
    'paint': {
      // increase the radii of the circle as the zoom level and dbh value increases
      'circle-radius': {
        'property': 'cases',
        'stops': [
            [grades[0], radii[0]],
            [grades[1], radii[1]],
            [grades[2], radii[2]],
            [grades[3], radii[3]]
        ]
      },
      'circle-color': {
        'property': 'cases',
        'stops': [
            [grades[0], colors[0]],
            [grades[1], colors[1]],
            [grades[2], colors[2]],
            [grades[3], colors[3]]
        ]
      },
      'circle-stroke-color': 'black',
      'circle-stroke-width': 1,
      'circle-opacity': 0.8
    }
  });

  // click on a circle to view number of cases in a popup
  map.on('click', 'case-point', (event) => {
    new mapboxgl.Popup()
      .setLngLat(event.features[0].geometry.coordinates)
      .setHTML(`<ul>
               <li><strong>County: </strong> ${event.features[0].properties.county}</li>
               <li><strong>Case: </strong> ${event.features[0].properties.cases}</li>
               <li><strong>Desths: </strong> ${event.features[0].properties.deaths}</li>
               </ul>`)
      .addTo(map);
  });
});

//set up legend grades and labels
var labels = ['<strong>Number of Cases</strong>'], vbreak;
//iterate through grades and create a scaled circle and label for each
for (var i = 0; i < grades.length; i++) {
    vbreak = grades[i];
    dot_radius = radii[i];
    labels.push(
        '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' +
        dot_radius * 0.75 + 'px; height: ' + dot_radius * 0.75 +
        'px; "></i> <span class="dot-label" style="top: ' + dot_radius / 2 + 'px;">' +
        vbreak / 1000 + 'k</span></p>');

}

// Add data source to legend.
legend.innerHTML = labels.join('') + source;

/*---------------------------------------Helper Functions-----------------------------------------*/

function id(tag) {
  return document.getElementById(tag);
}