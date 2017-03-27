import AggregateWidget from './aggregate-widget';

import template from '../../templates/widget/category-widget.hbs';

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
   * @param {String} [config.totalLabel='Total'] - Label to be shown within total count
   * @param {Object} config.categories - Categories configuration
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
    this.labels = Object.getOwnPropertyNames(this.categories.values || {});
    this.colors = this.labels.map((label => this.categories.values[label].color));
    this.function = 'Count';
    this.template = template;
    this.className = 'category-widget';
    this.totalLabel = config.totalLabel || 'Total';
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
    this.value = {
      totalLabel: this.totalLabel,
    };

    this.value.total = value.AggregationResults.reduce((accumulator, current) => (
      accumulator + current[1]
    ), 0);

    let categoryValue;
    this.value.values = this.labels.map((category, index) => {
      const categoryResult = value.AggregationResults.filter(result => result[0] === category);
      categoryValue = categoryResult.length ? categoryResult[0][1] : 0;
      return {
        category,
        value: categoryValue,
        percentage: Math.round((categoryValue / this.value.total) * 100) || 0,
        color: this.colors[index],
      };
    });
  }
}

export default CategoryWidget;
