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
  * @param {String} [config.geometryName=geom] - Name of the geometry column
  * @param {String} [config.attribution=''] - Layer data attribution
  * @param {Boolean} [config.exclusive=false] - If true, when the layer is shown,
  *   all other overlay layers are hidden
  * @param {Float} [config.opacity=1] - Layer opacity
  * @param {Filter[]} [config.filters] - Set of filters to apply to the layer. Overrides global dashboard filters.
  */
  constructor(config = {}) {
    config.title = config.title || 'OverlayLayer';
    config.visible = config.visible || false;
    config.opacity = config.opacity || 1;
    super(config);

    this.server = config.server;
    this.layerName = config.layer;
    this.geometryName = config.geometryName || 'geom';
    this.attribution = config.attribution || '';
    this.exclusive = config.exclusive || false;
    this.filters = config.filters;
  }

  /**
  * All filter strings joined by logical operator
  * @member {String}
  * @readonly
  */
  get filterString() {
    if (!this.filters || !this.filters.length) return null;
    let filter = this.filters[0].toString();
    for (let i = 1; i < this.filters.length; i++) {
      filter += ` ${this.filters[i].logicalOperator} ${this.filters[i]}`;
    }
    return filter;
  }
}

export default OverlayLayer;
