import Tile from 'ol/layer/tile';

import Layer from './layer';

/**
 * Tile layer used as base for map
 * @extends Layer
 */
class BaseLayer extends Layer {
  /**
  * @param {Object} [config] - Configuration object
  * @param {String} [config.title='BaseLayer'] - Layer title
  * @param {Boolean} [config.visible=false] - Layer initial status
  * @param {Object} [config.layerParams] - Extra params for OpenLayers Layer constructor
  * @param {Object} [config.sourceParams] - Extra params for OpenLayers Source constructor
  */
  constructor(config = {}) {
    config.title = config.title || 'BaseLayer';
    super(config);

    this.base = true;

    this.layer = new Tile(Object.assign({
      title: this.title,
      preload: Infinity,
      visible: this.visible,
      type: 'base',
      zIndex: -1,
    }, this.layerParams));
  }
}

export default BaseLayer;
