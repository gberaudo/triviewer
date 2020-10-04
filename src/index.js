import {Map, View} from 'ol';
import {Tile} from 'ol/layer';
import {fromLonLat} from 'ol/proj';
import OSM from 'ol/source/OSM';
import {ambit2GeojsonToVectorLayer} from './ambit2layer';
import {displayFeatureInfo} from './featureinfo';

const map = window['map'] = new Map({
  target: 'map',
  layers: [
    new Tile({
      source: new OSM()
    })
  ],
  view: new View({
    center: fromLonLat([6.56351, 46.51316]),
    zoom: 15
  })
});

fetch('data/2020_10_04_russel_1.geojson').then(
  r => r.json()
).then(json => {
  const vector = ambit2GeojsonToVectorLayer(json);
  map.addLayer(vector);
});



const infoDiv = document.getElementById('info');
map.on('pointermove', function (evt) {
  if (evt.dragging) {
    return;
  }
  var pixel = map.getEventPixel(evt.originalEvent);
  displayFeatureInfo(pixel, map, infoDiv);
});

map.on('click', function (evt) {
  displayFeatureInfo(evt.pixel, map, infoDiv);
});