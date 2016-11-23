import AggregateWidget from './aggregate-widget';

import template from '../../templates/widget/group-widget.hbs';

/**
 * Widget that shows grouped data fetched using WPS Aggregate
 * @extends AggregateWidget
 */
class CategoryWidget extends AggregateWidget {
  /**
   * @param {Object} config - Configuration object
   * @param {String} config.title - Widget title
   * @param {String} config.server - URL of map server
   * @param {String} config.layerName - Name of the layer to query
   * @param {String} config.property - Field to use in aggregate function
   * @param {Object} config.categories - Group categories configuration
   * @param {String} config.categories.property - Property that defines the style to use
   * @param {Object} config.style.values - Object with possible values
   *   and their correspoding style
   * @param {Function} [config.format] - Function to parse and transform data fetched from server.
   *   This function should return a human friendly value as it will be shown as
   *   the widget current value.
   */
  constructor(config) {
    super(config);
    this.categories = config.categories;
    this.function = 'Count';
    this.template = template;
  }

  /**
   * Processes the widget value and returns a human friendly version.
   * @returns {Object} - Current widget value prepared to be shown
   * @protected
   */
  format() {
    return this.value;
  }

  /**
   * Parses data fetched from server and sets widget value to an easily readable format
   * @param {Object} value - JSON data fetched from server
   * @protected
   */
  parseResponse(value) {
    this.value = value.AggregationResults.map(category => ({
      category: category[0],
      value: parseInt(category[1], 10),
    }));
  }
}

export default CategoryWidget;
