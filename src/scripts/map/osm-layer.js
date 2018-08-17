import OSM from 'ol/source/osm';

import BaseLayer from './base-layer';

/**
 * OpenStreetMap base layer
 * @extends BaseLayer
 */
class OSMLayer extends BaseLayer {
  /**
  * @param {Object} [config] - Configuration object
  * @param {String} [config.title='OpenStreetMap'] - Layer title
  * @param {Boolean} [config.visible=true] - Layer initial status
  * @param {Object} [config.layerParams] - Extra params for OpenLayers Layer constructor
  * @param {Object} [config.sourceParams] - Extra params for OpenLayers Source constructor
  */
  constructor(config = {}) {
    config.title = config.title || 'OpenStreetMap';
    super(config);

    this.source = new OSM(this.sourceParams);
  }
}

export default OSMLayer;
