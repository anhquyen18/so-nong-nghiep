import { Map } from 'ol';
import { mapState } from '../stores/map-state';

// const map = mapState().getMap;
// console.log(mapState().getMap);
/**
 * Hiển thị thông báo với nội dung và kiểu cho trước.
 *
 * @param {Map} map - Map.
 * @param {string} title - Title string,
 * @param {number} layerGroupIndex - Index of LayerGroup in Map.
 */
function getMainLayerByTitle(map, title) {
  const mainLayer = map.getLayers().getArray()[1].getLayers().getArray();
  var layer = null;
  mainLayer.forEach((element) => {
    if (element.get('title') == title) {
      layer = element;
    }
  });
  return layer;
}

function getLayerByTitle(map, title, layerGroupIndex) {
  let mainLayer;
  let layer;
  if (layerGroupIndex) {
    mainLayer = map.getLayers().getArray()[layerGroupIndex].getLayers().getArray();
  } else {
    mainLayer = map.getLayers().getArray();
  }

  mainLayer.some((element, index) => {
    if (element.get('title') === title) {
      layer = element;
      return true;
    }
  });
  return layer;
}

function getAllLayerTitle(map, layerGroupIndex) {
  let mainLayer;
  let titleArray = [];
  if (layerGroupIndex) {
    mainLayer = map.getLayers().getArray()[layerGroupIndex].getLayers().getArray();
  } else {
    mainLayer = map.getLayers().getArray();
  }
  mainLayer.forEach((element) => {
    titleArray.push(element.get('title'));
  });
  return titleArray;
}

export { getLayerByTitle, getAllLayerTitle };
