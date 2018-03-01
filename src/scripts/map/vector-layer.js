import color from 'ol/color';
import Style from 'ol/style/style';
import Circle from 'ol/style/circle';
import Fill from 'ol/style/fill';
import Stroke from 'ol/style/stroke';

import OverlayLayer from './overlay-layer';

import styleVariables from '../../styles/_variables.scss';

/**
 * Vector Layer
 * @extends OverlayLayer
 */
class VectorLayer extends OverlayLayer {
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
   */
  constructor(Vector, config = {}) {
    super(config);

    config.style = config.style || {};
    config.style.minRadius = config.style.minRadius || 3;
    config.style.maxRadius = config.style.maxRadius || 10;

    this.styleCache = {};
    this.style = config.style;
    this.popup = config.popup;

    this.layer = new Vector({
      title: this.title,
      visible: this.visible,
      exclusive: this.exclusive,
    });
    this.layer.setStyle(this.setStyle.bind(this));

    this.layer.popup = config.popup;
  }

  /**
   * Reloads layer data using current filters
   */
  refresh() {
    this.source.clear();
  }

  /**
   * Sets feature style
   * @param {Object} feature - Openlayers' [feature](https://openlayers.org/en/latest/apidoc/ol.Feature.html) object
   * @param {Number} resolution - Current map resolution
   * @returns {Object} - Openlayers' [style](https://openlayers.org/en/latest/apidoc/ol.style.Style.html) object
   * @private
   */
  setStyle(feature, resolution) {
    const value = feature.get(this.style.property);
    if (!value || !this.style.values[value]) {
      return this.style.defaultStyle || this.buildDefaultStyle();
    }
    if (!this.styleCache[value]) {
      this.styleCache[value] = {};
    }
    if (!this.styleCache[value][resolution]) {
      const radius = Math.min(
        Math.max(
          this.style.minRadius,
          Math.ceil(this.style.maxRadius / Math.log(Math.ceil(resolution))),
        ),
        this.style.maxRadius,
      );
      this.styleCache[value][resolution] = new Style({
        image: new Circle({
          fill: new Fill({
            color: color.asArray(this.style.values[value].color),
          }),
          radius,
          stroke: this.buildDefaultStroke(),
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
  buildDefaultStroke() {
    if (!this.defaultStroke) {
      this.defaultStroke = new Stroke({
        color: styleVariables.primaryColor,
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
  buildDefaultFill() {
    if (!this.defaultFill) {
      this.defaultFill = new Fill({
        color: styleVariables.primaryColor,
      });
    }
    return this.defaultFill;
  }

  /**
   * Builds default style
   * @returns {Object} Openlayers' [Style](https://openlayers.org/en/latest/apidoc/ol.style.Style.html) object
   * @private
   */
  buildDefaultStyle() {
    if (!this.defaultStyle) {
      this.defaultStyle = new Style({
        fill: this.buildDefaultFill(),
        stroke: this.buildDefaultStroke(),
        image: new Circle({
          fill: this.buildDefaultFill(),
          radius: this.style.minRadius,
          stroke: this.buildDefaultStroke(),
        }),
      });
    }
    return [this.defaultStyle];
  }
}

export default VectorLayer;
