import Widget from './widget';

import template from '../../templates/widget/wps-widget.hbs';

/**
 * Base class for Web Processing Service widgets
 * @extends Widget
 */
class WPSWidget extends Widget {
  /**
   * @param {Object} config - Configuration object
   * @param {String} config.title - Widget title
   * @param {String} config.server - URL of map server
   * @param {Object} config.namespace - Namespace object
   * @param {String} config.namespace.name - Namespace to use
   * @param {String} config.namespace.url - Namespace URL
   * @param {String} config.layerName - Name of the layer to query
   * @param {String} [config.geometryName=geom] - Name of the geometry column
   * @param {Function} [config.format] - Function to parse and transform data fetched from server.
   *   This function should return a human friendly value as it will be shown as
   *   the widget current value.
   */
  constructor(config) {
    super(config);

    this.layerName = config.layer;
    this.geometryName = config.geometryName || 'geom';
    this.server = `${config.server}/wps/`;
    this.namespace = config.namespace;
    this.template = template;
    this.className = 'wps-widget';
  }

  /**
   * Processes the widget value and returns a human friendly version.
   * @returns {Object} - Current widget value prepared to be shown
   * @protected
   */
  format() {
    return parseInt(this.value, 10);
  }

  /**
   * Reloads the widget value using the formatted value.
   */
  refresh() {
    if (!this.manager.extent) {
      return;
    }

    this.getData((data) => {
      this.parseResponse(data);
      super.refresh();
    });
  }

  /**
   * Sends query to server and parses response as JSON.
   * @param {Function} callback - Callback function to call when data is fetched
   * @private
   */
  getData(callback) {
    fetch(this.server, {
      method: 'POST',
      body: this.requestTemplate({
        layer: this.layerName,
        geometryName: this.geometryName,
        property: this.property,
        function: this.function,
        category: this.categories ? this.categories.property : null,
        extent: this.manager.extent,
        filters: this.manager.filters,
        namespace: this.namespace,
      }),
      headers: new Headers({
        'Content-Type': 'text/xml',
      }),
    }).then(response => response.json()).then(callback);
  }
}

export default WPSWidget;
