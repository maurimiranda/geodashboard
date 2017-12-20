import ol from 'openlayers';

import OverlayLayer from './overlay-layer';

/**
 * Web Map Service Layer
 * @extends OverlayLayer
 */
class WMSLayer extends OverlayLayer {
  /**
   * @param {Object} config - Configuration object
   * @param {String} [config.title='OverlayLayer'] - Layer title
   * @param {Boolean} [config.visible=false] - Layer initial status
   * @param {String} config.server - URL of map server
   * @param {String} config.layerName - Name of layer to display
   * @param {String} [config.attribution=''] - Layer data attribution
   * @param {Boolean} [config.exclusive=false] - If true, when the layer is shown,
   *   all other overlay layers are hidden
   * @param {String} config.style - The style or styles to be used with the layer
   * @param {Boolean} [config.tiled=false] - Use tiles or single image WMS
   */
  constructor(config = {}) {
    super(config);
    this.server = `${config.server}/wms/`;
    this.style = config.style;

    const layerConfig = {
      title: this.title,
      visible: this.visible,
      exclusive: this.exclusive,
      zIndex: 1,
      opacity: this.opacity,
    };

    const sourceConfig = {
      url: this.server,
      params: {
        LAYERS: this.layerName,
        STYLES: this.style,
      },
      attributions: [new ol.Attribution({
        html: this.attribution,
      })],
    };

    if (config.tiled) {
      this.layer = new ol.layer.Tile(layerConfig);
      this.source = new ol.source.TileWMS(sourceConfig);
    } else {
      this.layer = new ol.layer.Image(layerConfig);
      this.source = new ol.source.ImageWMS(sourceConfig);
    }
  }

  /**
   * Reloads layer data using current filters
   */
  refresh() {
    if (this.manager.filters.length) {
      const params = this.layer.getSource().getParams();
      params.CQL_FILTER = this.manager.filterString;
      this.source.updateParams(params);
    }
  }
}

export default WMSLayer;
