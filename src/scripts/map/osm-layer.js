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
  */
  constructor(config = {}) {
    config.title = config.title || 'OpenStreetMap';
    super(config);

    this.source = new OSM();
  }
}

export default OSMLayer;
