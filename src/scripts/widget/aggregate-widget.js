import WPSWidget from './wps-widget';

import requestTemplate from '../../templates/widget/wps/aggregate.hbs';

/**
 * Widget that shows a WPS Aggregate function result
 * @extends WPSWidget
 */
export default class AggregateWidget extends WPSWidget {
  /**
   * @param {Object} config - Configuration object
   * @param {String} config.title - Widget title
   * @param {String} config.server - URL of map server
   * @param {String} config.layerName - Name of the layer to query
   * @param {String} config.function - Aggregate function to execute.
   *   Options: 'Count', 'Average', 'Max', 'Median', 'Min', 'StdDev', or 'Sum'
   * @param {String} config.property - Field to use in aggregate function
   * @param {Function} [config.format] - Function to parse and transform data fetched from server.
   *   This function should return a human friendly value as it will be shown as
   *   the widget current value.
   */
  constructor(config) {
    super(config);
    this.property = config.property;
    this.function = config.function;
    this.requestTemplate = requestTemplate;
  }

  /**
   * Parses data fetched from server and sets widget value to an easly readable format
   * @param {Object} value - JSON data fetched from server
   * @protected
   */
  parseResponse(value) {
    this.value = value.AggregationResults[0];
  }
}
