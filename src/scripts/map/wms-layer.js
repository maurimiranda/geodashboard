import Attribution from 'ol/attribution';
import Tile from 'ol/layer/tile';
import Image from 'ol/layer/image';
import TileWMS from 'ol/source/tilewms';
import ImageWMS from 'ol/source/imagewms';

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
   * @param {Boolean} [config.useCache=false] - Use GeoWebCache URL instead of direct WMS
   * @param {Filter[]} [config.filters] - Set of filters to apply to the layer. Overrides global dashboard filters.
   * @param {Object} [config.layerParams] - Extra params for OpenLayers Layer constructor
   * @param {Object} [config.sourceParams] - Extra params for OpenLayers Source constructor
   */
  constructor(config = {}) {
    super(config);

    if (config.useCache) {
      this.server = `${config.server}/gwc/service/wms/`;
    } else {
      this.server = `${config.server}/wms/`;
    }

    this.style = config.style;

    const layerConfig = Object.assign({
      title: this.title,
      visible: this.visible,
      exclusive: this.exclusive,
      zIndex: 1,
      opacity: this.opacity,
    }, this.layerParams);

    const sourceConfig = Object.assign({
      url: this.server,
      params: {
        LAYERS: this.layerName,
        STYLES: this.style,
      },
      attributions: [new Attribution({
        html: this.attribution,
      })],
    }, this.sourceParams);

    if (config.tiled) {
      this.layer = new Tile(layerConfig);
      this.source = new TileWMS(sourceConfig);
    } else {
      this.layer = new Image(layerConfig);
      this.source = new ImageWMS(sourceConfig);
    }
  }

  /**
   * Reloads layer data using current filters
   */
  refresh() {
    const params = this.layer.getSource().getParams();

    if (!params.srs) {
      params.srs = this.manager.view.getProjection().getCode();
    }
    if (this.filters) {
      if (this.filters.length) {
        params.CQL_FILTER = this.filterString;
        this.source.updateParams(params);
      }
    } else if (this.manager.filters.length) {
      params.CQL_FILTER = this.manager.filterString;
      this.source.updateParams(params);
    }
  }
}

export default WMSLayer;
