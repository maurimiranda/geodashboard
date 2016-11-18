import ol from 'openlayers';

import BaseLayer from './base-layer';

/**
 * Bing Aerial base layer
 * @extends BaseLayer
 */
class BingLayer extends BaseLayer {
  /**
  * @param {Object} [config] - Configuration object
  * @param {String} [config.title='Bing Aerial'] - Layer title
  * @param {Boolean} [config.visible=true] - Layer initial status
  */
  constructor(config = {}) {
    config.title = config.title || 'Bing Aerial';
    super(config);

    this.source = new ol.source.BingMaps({
      key: config.key,
      imagerySet: 'Aerial',
    });
  }
}

export default BingLayer;
