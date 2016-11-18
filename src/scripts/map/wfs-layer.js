import ol from 'openlayers';

import OverlayLayer from './overlay-layer';

/**
 * WFS Layer
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
  * @param {Object} config.style.property - Property that defines the style to use
  * @param {Object} config.style.values - Object with possible values
  *   and their correspoding style
  * @param {Object[]} [config.popup] - Data to show when user clicks
  *   on a feature in the map
  * @param {String} config.property - Name of the field to show
  * @param {String} [config.title] - Text to show as field title
  */
  constructor(config = {}) {
    super(config);

    this.server = `${config.server}/wfs/`;
    this.format = new ol.format.GeoJSON();
    this.styleCache = {};
    this.style = config.style;

    this.layer = new ol.layer.Vector({
      title: this.title,
      visible: this.visible,
      exclusive: this.exclusive,
    });
    this.layer.setStyle(this.setStyle.bind(this));

    this.source = new ol.source.Vector({
      loader: this.loadFeatures.bind(this),
      strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
        maxZoom: 19,
      })),
      attributions: [new ol.Attribution({
        html: this.attribution,
      })],
    });

    this.layer.popup = config.popup;
  }

  /**
   * Refreshes layer
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
    }).then(response => response.json()).then((data) => {
      this.source.addFeatures(this.format.readFeatures(data));
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
      const radius = Math.min(Math.max(3, Math.ceil(40 / Math.log(Math.ceil(resolution)))), 20);
      let text;
      if (resolution < 100) {
        text = new ol.style.Text({
          fill: new ol.style.Fill({
            color: '#005D93',
          }),
          stroke: new ol.style.Stroke({
            color: '#fff',
            width: 3,
          }),
          text: value,
          font: `${radius}px`,
        });
      }
      this.styleCache[value][resolution] = new ol.style.Style({
        image: new ol.style.Circle({
          fill: new ol.style.Fill({
            color: ol.color.asArray(this.style.values[value].color),
          }),
          radius,
          stroke: this.getDefaultStroke(),
        }),
        text,
      });
    }
    return [this.styleCache[value][resolution]];
  }

  /**
   * Builds default stroke style
   * @returns {Object} Openlayers' [Stroke](https://openlayers.org/en/latest/apidoc/ol.style.Stroke.html) object
   */
  getDefaultStroke() {
    if (!this.defaultStroke) {
      this.defaultStroke = new ol.style.Stroke({
        color: [0, 0, 0, 0.5],
        width: 1,
      });
    }
    return this.defaultStroke;
  }

  /**
   * Builds default fill style
   * @returns {Object} Openlayers' [Fill](https://openlayers.org/en/latest/apidoc/ol.style.Fill.html) object
   */
  getDefaultFill() {
    if (!this.defaultFill) {
      this.defaultFill = new ol.style.Fill({
        color: [255, 255, 255, 0.5],
      });
    }
    return this.defaultFill;
  }

  /**
   * Builds default text style
   * @param {Number} radius
   * @returns {Object} Openlayers' [Text](https://openlayers.org/en/latest/apidoc/ol.style.Text.html) object
   */
  getDefaultText(radius) {
    if (!this.defaultText) {
      this.defaultText = new ol.style.Text({
        offsetY: radius * 1.5,
        fill: new ol.style.Fill({
          color: '#666',
        }),
        stroke: new ol.style.Stroke({
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
   */
  getDefaultStyle() {
    if (!this.defaultStyle) {
      this.defaultStyle = new ol.style.Style({
        fill: this.getDefaultFill(),
        stroke: this.getDefaultStroke(),
        image: new ol.style.Circle({
          fill: this.getDefaultFill(),
          radius: 10,
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
