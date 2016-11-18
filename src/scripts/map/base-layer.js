import ol from 'openlayers';

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
  */
  constructor(config = {}) {
    config.title = config.title || 'BaseLayer';
    super(config);

    this.base = true;

    this.layer = new ol.layer.Tile({
      title: this.title,
      preload: Infinity,
      visible: this.visible,
      type: 'base',
      zIndex: -1,
    });
  }
}

export default BaseLayer;
