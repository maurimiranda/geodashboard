import WPSWidget from './wps-widget';

import requestTemplate from '../../templates/widget/wps/count.hbs';

/**
 * Widget that shows a WPS Count function result
 * @extends WPSWidget
 */
class CountWidget extends WPSWidget {
  /**
   * @param {Object} config - Configuration object
   * @param {String} config.title - Widget title
   * @param {String} config.server - URL of map server
   * @param {String} config.layerName - Name of the layer to query
   * @param {Function} [config.format] - Function to parse and transform data fetched from server.
   *   This function should return a human friendly value as it will be shown as
   *   the widget current value.
   */
  constructor(config) {
    super(config);
    this.requestTemplate = requestTemplate;
  }

  /**
   * Parses data fetched from server and sets widget value to an easly readable format
   * @param {Object} value - JSON data fetched from server
   * @protected
   */
  parseResponse(value) {
    this.value = parseInt(value, 10);
  }
}

export default CountWidget;
