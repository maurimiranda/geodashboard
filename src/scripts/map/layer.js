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
  */
  constructor(config = {}) {
    super();

    config.title = config.title || 'Layer';
    config.visible = config.visible || false;

    this.title = config.title;
    this.visible = config.visible;
    this.id = Dashboard.uid();
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
    return this.layer.getSource();
  }

  set source(value) {
    this.layer.setSource(value);
  }
}

export default Layer;
