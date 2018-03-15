import Vector from 'ol/layer/vectortile';
import MVT from 'ol/format/mvt';
import VectorTile from 'ol/source/vectortile';
import loadingstrategy from 'ol/loadingstrategy';
import tilegrid from 'ol/tilegrid';
import Attribution from 'ol/attribution';
import Style from 'ol/style/style';

import VectorLayer from './vector-layer';

/**
 * MapBox Vector Tile Layer
 * @extends VectorLayer
 */
class MVTLayer extends VectorLayer {
  /**
   * @param {Object} config - Configuration object
   * @param {String} [config.title='OverlayLayer'] - Layer title
   * @param {Boolean} [config.visible=false] - Layer initial status
   * @param {String} config.server - URL of map server
   * @param {String} config.layerName - Name of layer to display
   * @param {String} [config.attribution=''] - Layer data attribution
   * @param {Boolean} [config.exclusive=false] - If true, when the layer is shown, all other overlay layers are hidden
   * @param {Object} config.style - Style configuration
   * @param {String} config.style.property - Property that defines the style to use
   * @param {Object} config.style.values - Object with possible valuesand their corresponding style
   * @param {Object} [config.style.minRadius=3] - Mininum radius to use for feature style
   * @param {Object} [config.style.maxRadius=10] - Maximum radius to use for feature style
   * @param {Object[]} [config.popup] - Data to show when user clicks on a feature in the map
   * @param {String|String[]} [config.popup[].property] - Name of field or array of fields names to show
   * @param {String} [config.popup[].title] - Text to show as title
   * @param {Function} [config.popup[].format] - Function to process field or fields value
   * @param {Filter[]} [config.filters] - Set of filters to apply to the layer. Overrides global dashboard filters.
   */
  constructor(config = {}) {
    super(Vector, config);

    this.server = `${config.server}/gwc/service/tms/1.0.0/`;
    this.format = new MVT();

    this.source = new VectorTile({
      url: `${this.server}${this.layerName}@EPSG:900913@pbf/{z}/{x}/{-y}.pbf`,
      format: this.format,
      strategy: loadingstrategy.tile(tilegrid.createXYZ({
        maxZoom: 19,
      })),
      attributions: [new Attribution({
        html: this.attribution,
      })],
    });
  }

  /**
   * Sets feature style
   * @override
   * @private
   */
  setStyle(feature, resolution) {
    if (!this.filter(feature)) return new Style({});
    return super.setStyle(feature, resolution);
  }

  /**
   * Executes filters over feature to define its visibilty
   * @param {Object} feature - Openlayers' [feature](https://openlayers.org/en/latest/apidoc/ol.Feature.html) object
   * @returns {Boolean} - If true, feature must be shown
   * @private
   */
  filter(feature) {
    // TODO: implement complex filters
    let filterFeature = true;
    if (this.filters) {
      this.filters.forEach((filter) => {
        filterFeature = filter.execute(feature.get(filter.property));
      });
    } else if (this.manager.filters) {
      this.manager.filters.forEach((filter) => {
        filterFeature = filter.execute(feature.get(filter.property));
      });
    }
    return filterFeature;
  }
}

export default MVTLayer;
