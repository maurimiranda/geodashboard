import BingMaps from 'ol/source/bingmaps';

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
  * @param {Object} [config.layerParams] - Extra params for OpenLayers Layer constructor
  * @param {Object} [config.sourceParams] - Extra params for OpenLayers Source constructor
  */
  constructor(config = {}) {
    config.title = config.title || 'Bing Aerial';
    super(config);

    this.source = new BingMaps(Object.assign({
      key: config.key,
      imagerySet: 'Aerial',
    }, this.sourceParams));
  }
}

export default BingLayer;
