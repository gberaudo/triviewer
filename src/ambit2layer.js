import GeoJSON from 'ol/format/GeoJSON'; // OL GPX format is very poor, using GeoJSON features exported from QGIS instead
import VectorSource from 'ol/source/Vector';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {Vector as VectorLayer} from 'ol/layer';

function createCircle(color) {
  return new CircleStyle({
    fill: new Fill({
      color: color,
    }),
    radius: 5,
    stroke: new Stroke({
      color: '#000',
      width: 1,
    }),
  })
}
const greenCircle = createCircle('green');
const redCircle = createCircle('red');


var style = {
  'Point': new Style({
    image: greenCircle,
  }),
  'LineString': new Style({
    stroke: new Stroke({
      color: '#f00',
      width: 3,
    }),
  }),
  'MultiLineString': new Style({
    stroke: new Stroke({
      color: '#0f0',
      width: 3,
    }),
  }),
};

function parseDate(str) {
  // dates are in UTC, 
  // "2020\/10\/04 09:27:00" -> 11:27
  const sp = str.split(' ');
  const spd = sp[0].split('/');
  const spt = sp[1].split(':');
  return new Date(Date.UTC(spd[0], spd[1], spd[2], spt[0], spt[1], spt[2]));
}

export function ambit2GeojsonToVectorLayer(json) {
  const format = new GeoJSON({
    featureProjection: 'EPSG:3857'
  });
  const features = format.readFeatures(json);
  features.forEach(f => {
    const p = f.getProperties();

    const newP = {
      geometry: p.geometry,
      time: p.time,
      date: parseDate(p.time),
      hr: p.gpxdata_hr,
      speed: p.gpxdata_speed,
      ele: p.ele,
      type: 'bike',
    };
    if (p.gpxdata_cadence) {
      newP.cadence = p.gpxdata_cadence;
      newP.type = 'run'
    }
    f.setId(p.track_seg_point_id);

    for (const key of f.getKeys()) {
      f.unset(key, true);
    }
    f.setProperties(newP);
  });


  const vector = new VectorLayer({
    source: new VectorSource({
      features: features,
    }),
    style: function (feature) {
      if (feature.get('type') === 'run') {
        return;
      }
      const s = style[feature.getGeometry().getType()];
      const img =feature.get('hr') > 155 ? redCircle : greenCircle;
      s.setImage(img);
      return s;
    },
  });
  return vector;
}
