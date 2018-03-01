import 'whatwg-fetch';
import 'url-search-params-polyfill';

import GeoJSON from 'ol/format/geojson';
import Vector from 'ol/layer/vector';
import Heatmap from 'ol/layer/heatmap';
import VectorSource from 'ol/source/vector';
import loadingstrategy from 'ol/loadingstrategy';
import tilegrid from 'ol/tilegrid';
import Attribution from 'ol/attribution';

import VectorLayer from './vector-layer';

/**
 * Web Feature Service Layer
 * @extends VectorLayer
 */
class WFSLayer extends VectorLayer {
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
   * @param {Object} config.style.values - Object with possible values and their corresponding style
   * @param {Object} [config.style.minRadius=3] - Mininum radius to use for feature style
   * @param {Object} [config.style.maxRadius=10] - Maximum radius to use for feature style
   * @param {Object[]} [config.popup] - Data to show when user clicks on a feature in the map
   * @param {String|String[]} [config.popup[].property] - Name of field or array of fields names to show
   * @param {String} [config.popup[].title] - Text to show as title
   * @param {Function} [config.popup[].format] - Function to process field or fields value
   * @param {Float} [config.opacity=1] - Layer opacity
   * @param {Object} [config.heatmap] - Show layer as heatmap
   * @param {Integer} [config.heatmap.blur=15] - Blur size in pixels
   * @param {Integer} [config.heatmap.radius=8] - Radius size in pixels
   * @param {String[]} [config.heatmap.gradient=['#00f', '#0ff', '#0f0', '#ff0', '#fa0', '#f00']] - Gradient to use
   */
  constructor(config = {}) {
    super(Vector, config);

    this.server = `${config.server}/wfs/`;
    this.format = new GeoJSON();

    if (config.heatmap) {
      config.blur = config.blur || 15;
      config.radius = config.radius || 8;
      config.gradient = ['#00f', '#0ff', '#0f0', '#ff0', '#fa0', '#f00'];

      this.layer = new Heatmap({
        title: this.title,
        visible: this.visible,
        exclusive: this.exclusive,
        blur: config.blur,
        radius: config.radius,
        gradient: config.gradient,
        opacity: config.opacity,
      });
    }

    this.source = new VectorSource({
      loader: this.loadFeatures.bind(this),
      strategy: loadingstrategy.tile(tilegrid.createXYZ({
        maxZoom: 19,
      })),
      attributions: [new Attribution({
        html: this.attribution,
      })],
    });

    this.loading = 0;
  }

  /**
   * Loads features from server via WFS service
   * @param {Number[]} extent - Array of numbers representing an extent: [minx, miny, maxx, maxy]
   * @private
   */
  loadFeatures(extent) {
    this.loading += 1;
    const params = new URLSearchParams();
    params.append('service', 'WFS');
    params.append('version', '1.0.0');
    params.append('request', 'GetFeature');
    params.append('outputFormat', 'application/json');
    params.append('format_options', 'CHARSET:UTF-8');
    params.append('typename', this.layerName);
    params.append('srsname', this.manager.viewProjection.getCode());
    params.append('cql_filter', this.buildCQLFilter(extent));
    fetch(`${this.server}?${params.toString()}`, {
      mode: 'cors',
    }).then(response => response.json())
      .catch(() => null)
      .then((data) => {
        if (data) {
          this.source.addFeatures(this.format.readFeatures(data));
        }
        this.loading -= 1;
        if (this.loading === 0) {
          this.emit('loaded');
        }
      });
  }

  /**
   * Builds CQLFilter string based on current extent and dashboard filters
   * @param {Number[]} extent - Array of numbers representing an extent: [minx, miny, maxx, maxy]
   * @returns {String}
   * @private
   */
  buildCQLFilter(extent) {
    let cqlFilter = `bbox(geom, ${extent.join(',')}, '${this.manager.viewProjection.getCode()}')`;
    if (this.manager.filterString) {
      cqlFilter = `${cqlFilter} AND ${this.manager.filterString}`;
    }
    return cqlFilter;
  }
}

export default WFSLayer;
