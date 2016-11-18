import Layer from './layer';

/**
 * Overlay layer
 * @extends Layer
 */
class OverlayLayer extends Layer {
  /**
  * @param {Object} config - Configuration object
  * @param {String} [config.title='OverlayLayer'] - Layer title
  * @param {Boolean} [config.visible=false] - Layer initial status
  * @param {String} config.server - URL of map server
  * @param {String} config.layerName - Name of layer to display
  * @param {String} [config.attribution=''] - Layer data attribution
  * @param {Boolean} [config.exclusive=false] - If true, when the layer is shown,
  *   all other overlay layers are hidden
  */
  constructor(config = {}) {
    config.title = config.title || 'OverlayLayer';
    config.visible = config.visible || false;
    super(config);

    this.server = config.server;
    this.layerName = config.layer;
    this.attribution = config.attribution || '';
    this.exclusive = config.exclusive || false;
  }
}

export default OverlayLayer;
