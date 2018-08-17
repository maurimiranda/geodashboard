import EventEmitter from 'events';
import Dashboard from '../dashboard';

/**
 * Base class for any kind of map layer
 */
class Layer extends EventEmitter {
  /**
  * @param {Object} [config] - Configuration object
  * @param {String} [config.title='Layer'] - Layer title
  * @param {Boolean} [config.visible=false] - Layer initial status
  * @param {Object} [config.layerParams] - Extra params for OpenLayers Layer constructor
  * @param {Object} [config.sourceParams] - Extra params for OpenLayers Source constructor
  */
  constructor(config = {}) {
    super();

    config.title = config.title || 'Layer';
    config.visible = config.visible || false;

    this.title = config.title;
    this.visible = config.visible;
    this.id = Dashboard.uid();
    this.opacity = config.opacity;

    this.layerParams = config.layerParams;
    this.sourceParams = config.sourceParams;
  }

  /**
   * Fits map to this layer
   */
  fitMap() {
    this.manager.fitToLayer(this);
  }

  /**
   * Returns layer visibility status
   * @return {Boolean}
   */
  getVisible() {
    return this.layer.getVisible();
  }

  /**
   * Layer source object (One of OpenLayers' [ol.source](https://openlayers.org/en/latest/apidoc/ol.source.html) options)
   * @member {Object}
   */
  get source() {
    if (!this.layerSource && this.layer) {
      this.layerSource = this.layer.getSource();
    }
    return this.layerSource;
  }

  set source(value) {
    this.layerSource = value;
    if (this.layer) {
      this.layer.setSource(value);
    }
  }
}

export default Layer;
