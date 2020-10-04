
export var displayFeatureInfo = function (pixel, map, infoDiv) {
  const target = map.getTargetElement();
  if (!target) {
    return;
  }
  var features = [];
  map.forEachFeatureAtPixel(pixel, function (feature) {
    features.push(feature);
  });
  if (features.length > 0) {
    var info = [];
    var i, ii;
    for (i = 0, ii = features.length; i < ii; ++i) {
      const p = features[i].getProperties();
      info.push(`${p.time}: ${p.speed} ${p.hr} ${p.ele} ${p.cadence || ''}`);
    }
    infoDiv.innerHTML = info.join('<br />');
    target.style.cursor = 'pointer';
  } else {
    infoDiv.innerHTML = '&nbsp;';
    target.style.cursor = '';
  }
};
