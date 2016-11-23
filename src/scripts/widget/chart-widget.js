import Chart from 'chart.js';

import CategoryWidget from './category-widget';

import template from '../../templates/widget/chart-widget.hbs';

/**
 * Widget that shows a bar chart with grouped data fetched using WPS Aggregate
 * @extends CategoryWidget
 */
class ChartWidget extends CategoryWidget {
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
   * @param {Object} [config.chart] - Object with chart configuration
   * @param {String} [config.chart.type='bar'] - Chart type. Options: 'bar', 'pie' or 'doughnut'.
   * @param {Object} [config.chart.options] - Object with chart options based on [ChartJS](http://www.chartjs.org/docs/#chart-configuration).
   *   By default, the widget uses a bar chart without legend, Y axis nor gridlines.
   * @param {Function} [config.format] - Function to parse and transform data fetched from server.
   *   This function should return a human friendly value as it will be shown as
   *   the widget current value.
   */
  constructor(config) {
    super(config);
    this.template = template;
    this.labels = Object.getOwnPropertyNames(this.categories.values);
    this.colors = this.labels.map((label => this.categories.values[label].color));
    this.chartType = config.chart.type || 'bar';
    this.chartOptions = config.chart.options || this.getChartOptions();
  }

  /**
   * Builds default chart options based on its type
   * @return {Object} Chart options
   * @private
   */
  getChartOptions() {
    switch (this.chartType) {
      case 'bar':
        return {
          legend: {
            display: false,
          },
          scales: {
            xAxes: [{
              gridLines: {
                display: false,
              },
            }],
            yAxes: [{
              display: false,
            }],
          },
        };
      default:
        return {
          legend: {
            display: false,
          },
          scales: {
            xAxes: [{
              display: false,
            }],
            yAxes: [{
              display: false,
            }],
          },
        };
    }
  }

  /**
   * Renders the widget layout.
   */
  render() {
    super.render();
    this.container.getElementsByClassName('widget-content')[0].innerHTML = this.template({
      id: this.id,
      value: this.customFormat(this.value),
    });
    this.chart = new Chart(document.getElementById(this.id), {
      type: this.chartType,
      data: {
        labels: this.labels,
        datasets: [{
          data: [],
          backgroundColor: this.colors,
        }],
      },
      options: this.chartOptions,
    });
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
      this.chart.data.datasets[0].data = this.value;
      this.chart.update();
    });
  }

  /**
   * Parses data fetched from server and sets widget value to an easily readable format
   * @param {Object} value - JSON data fetched from server
   * @protected
   */
  parseResponse(value) {
    this.value = this.labels.map((category) => {
      const categoryResult = value.AggregationResults.filter(result =>
        result[0] === category
      );
      return categoryResult.length ? categoryResult[0][1] : 0;
    });
  }
}

export default ChartWidget;
