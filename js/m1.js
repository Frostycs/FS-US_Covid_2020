const layers = [
  'under 10',
  '10-20',
  '20-40',
  '40-60',
  '60-80',
  '80-90',
  'more than 90'
];
const colors = [
  '#FED97670',
  '#FEB24C70',
  '#FD8D3C70',
  '#FC4E2A70',
  '#E31A1C70',
  '#BD002670',
  '#00000070'
];

// Base map
mapboxgl.accessToken = 'pk.eyJ1IjoiZnJvc3R5Y3MiLCJhIjoiY2xkc2cwNGV2MWJjaDNucHJwbmZrMWp1aCJ9.3YXlm7pDCStLj3LTTnm_fQ';

mapboxgl.accessToken =
  'pk.eyJ1IjoiZnJvc3R5Y3MiLCJhIjoiY2xkc2cwNGV2MWJjaDNucHJwbmZrMWp1aCJ9.3YXlm7pDCStLj3LTTnm_fQ';
let map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/dark-v10', // style URL
  // Coordinates: 39.68454162791436, -97.01617575388282
  center: [-97.02, 39.68], // starting position [lng, lat]
  zoom: 4, // starting zoom
  projection: 'albers' // projection type
});

map.on('load', () => {
  map.addSource('rates', {
    type: 'geojson',
    data: 'assets/us-covid-2020-rates.json'
  });

  map.addLayer({
    'id': 'rate-layer',
    'type': 'fill',
    'source': 'rates',
    'paint': {
      'fill-color': [
        'step',
        ['get', 'rates'],
        '#FED976',   // stop_output_1
        10,          // stop_input_1
        '#FEB24C',   // stop_output_2
        20,          // stop_input_2
        '#FD8D3C',   // stop_output_3
        40,         // stop_input_3
        '#FC4E2A',   // stop_output_4
        60,         // stop_input_4
        '#E31A1C',   // stop_output_5
        80,         // stop_input_5
        '#BD0026',   // stop_output_6
        90,        // stop_input_6
        "#000000"    // stop_output_7
      ],
      'fill-outline-color': '#BBBBBB',
      'fill-opacity': 0.5,
    }
  });
});

const legend = id('legend');
legend.innerHTML = "<b>Cases per thousand residents</b>";
layers.forEach((layer, i) => {
    const color = colors[i];
    const item = document.createElement('div');
    const key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;

    const value = document.createElement('span');
    value.innerHTML = `${layer}`;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
});

map.on('mousemove', ({point}) => {
  const rates = map.queryRenderedFeatures(point, {
      layers: ['rate-layer']
  });
  document.getElementById('text-description').innerHTML = rates.length ?
      `<h3>County: ${rates[0].properties.county}</h3><p><strong><em>
      ${rates[0].properties.rates} cases per 1000 residents</strong></em></p>` :
      `<p>Hover over a county to see the exact number!</p>`;
});

var data_source = document.createElement("div");
data_source.innerHTML += "*Rates calculated from the 2018 ACS 5-year-estimates";
data_source.classList.add("footnote");
legend.appendChild(data_source)

/*---------------------------------------Helper Functions-----------------------------------------*/

function id(tag) {
  return document.getElementById(tag);
}