import 'whatwg-fetch';
import 'url-search-params-polyfill';

import GeoJSON from 'ol/format/geojson';
import Vector from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import loadingstrategy from 'ol/loadingstrategy';
import tilegrid from 'ol/tilegrid';
import Attribution from 'ol/attribution';
import color from 'ol/color';
import Style from 'ol/style/style';
import Circle from 'ol/style/circle';
import Fill from 'ol/style/fill';
import Stroke from 'ol/style/stroke';
import Text from 'ol/style/text';

import OverlayLayer from './overlay-layer';

/**
 * Web Feature Service Layer
 * @extends OverlayLayer
 */
class WFSLayer extends OverlayLayer {
  /**
   * @param {Object} config - Configuration object
   * @param {String} [config.title='OverlayLayer'] - Layer title
   * @param {Boolean} [config.visible=false] - Layer initial status
   * @param {String} config.server - URL of map server
   * @param {String} config.layerName - Name of layer to display
   * @param {String} [config.attribution=''] - Layer data attribution
   * @param {Boolean} [config.exclusive=false] - If true, when the layer is shown,
   *   all other overlay layers are hidden
   * @param {Object} config.style - Style configuration
   * @param {String} config.style.property - Property that defines the style to use
   * @param {Object} config.style.values - Object with possible values
   *   and their corresponding style
   * @param {Object[]} [config.popup] - Data to show when user clicks
   *   on a feature in the map
   * @param {String} config.popup[].property - Name of the field to show
   * @param {String} [config.popup[].title] - Text to show as field title
   */
  constructor(config = {}) {
    super(config);

    this.server = `${config.server}/wfs/`;
    this.format = new GeoJSON();
    this.styleCache = {};
    this.style = config.style;
    this.popup = config.popup;

    this.layer = new Vector({
      title: this.title,
      visible: this.visible,
      exclusive: this.exclusive,
    });
    this.layer.setStyle(this.setStyle.bind(this));

    this.source = new VectorSource({
      loader: this.loadFeatures.bind(this),
      strategy: loadingstrategy.tile(tilegrid.createXYZ({
        maxZoom: 19,
      })),
      attributions: [new Attribution({
        html: this.attribution,
      })],
    });

    this.layer.popup = config.popup;

    this.loading = 0;
  }

  /**
   * Reloads layer data using current filters
   */
  refresh() {
    this.source.clear();
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
   * Sets feature style
   * @param {Object} feature - Openlayers' [feature](https://openlayers.org/en/latest/apidoc/ol.Feature.html) object
   * @param {Number} resolution - Current map resolution
   * @private
   */
  setStyle(feature, resolution) {
    const value = feature.get(this.style.property);
    if (!value || !this.style.values[value]) {
      return this.getDefaultStyle();
    }
    if (!this.styleCache[value]) {
      this.styleCache[value] = {};
    }
    if (!this.styleCache[value][resolution]) {
      const radius = Math.min(Math.max(3, Math.ceil(10 / Math.log(Math.ceil(resolution)))), 10);
      this.styleCache[value][resolution] = new Style({
        image: new Circle({
          fill: new Fill({
            color: color.asArray(this.style.values[value].color),
          }),
          radius,
          stroke: this.getDefaultStroke(),
        }),
      });
    }
    return [this.styleCache[value][resolution]];
  }

  /**
   * Builds default stroke style
   * @returns {Object} Openlayers' [Stroke](https://openlayers.org/en/latest/apidoc/ol.style.Stroke.html) object
   * @private
   */
  getDefaultStroke() {
    if (!this.defaultStroke) {
      this.defaultStroke = new Stroke({
        color: [0, 0, 0, 0.5],
        width: 1,
      });
    }
    return this.defaultStroke;
  }

  /**
   * Builds default fill style
   * @returns {Object} Openlayers' [Fill](https://openlayers.org/en/latest/apidoc/ol.style.Fill.html) object
   * @private
   */
  getDefaultFill() {
    if (!this.defaultFill) {
      this.defaultFill = new Fill({
        color: [255, 255, 255, 0.5],
      });
    }
    return this.defaultFill;
  }

  /**
   * Builds default text style
   * @param {Number} radius
   * @returns {Object} Openlayers' [Text](https://openlayers.org/en/latest/apidoc/ol.style.Text.html) object
   * @private
   */
  getDefaultText(radius) {
    if (!this.defaultText) {
      this.defaultText = new Text({
        offsetY: radius * 1.5,
        fill: new Fill({
          color: '#666',
        }),
        stroke: new Stroke({
          color: '#FFFFFF',
          width: 2,
        }),
      });
    }
    return this.defaultText;
  }

  /**
   * Builds default style
   * @returns {Object} Openlayers' [Style](https://openlayers.org/en/latest/apidoc/ol.style.Style.html) object
   * @private
   */
  getDefaultStyle() {
    if (!this.defaultStyle) {
      this.defaultStyle = new Style({
        fill: this.getDefaultFill(),
        stroke: this.getDefaultStroke(),
        image: new Circle({
          fill: this.getDefaultFill(),
          radius: 5,
          stroke: this.getDefaultStroke(),
        }),
      });
    }
    return [this.defaultStyle];
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
