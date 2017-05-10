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
   * @param {Object} config.categories - Categories configuration
   * @param {String} config.categories.property - Property that defines the style to use
   * @param {Object} config.style.values - Object with possible values
   *   and their correspoding style
   * @param {Object} config.chart - Object with chart configuration
   * @param {String} config.chart.type - Chart type. Options: 'bar', 'pie' or 'doughnut'.
   * @param {Object} [config.chart.unit='value'] - Value to show. Options: 'value' or 'percentage'.
   * @param {Object} [config.chart.options] - Object with chart options based on [ChartJS](http://www.chartjs.org/docs/#chart-configuration).
   *   By default, the widget uses a bar chart without legend, Y axis nor gridlines.
   * @param {Function} [config.format] - Function to parse and transform data fetched from server.
   *   This function should return a human friendly value as it will be shown as
   *   the widget current value.
   */
  constructor(config) {
    super(config);
    this.template = template;
    this.chartType = config.chart.type;
    this.chartOptions = config.chart.options || this.getChartOptions();
    this.className = 'chart-widget';
    this.unit = config.chart.unit || 'value';
  }

  /**
   * Builds default chart options based on its type
   * @return {Object} Chart options
   * @private
   */
  getChartOptions() {
    const options = {
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

    if (this.chartType === 'bar') {
      options.scales.yAxes[0].display = true;
    } else if (this.chartType === 'doughnut') {
      options.rotation = Math.PI;
      options.circumference = Math.PI;
    }

    return options;
  }

  /**
   * Renders the widget layout.
   */
  render() {
    super.render();
    this.content.innerHTML = this.template();
    if (this.chartType === 'doughnut') {
      this.unit = 'percentage';
      this.container.classList.add('doughnut-widget');
    }
    this.chart = new Chart(this.content.getElementsByTagName('canvas')[0], {
      type: this.chartType,
      data: {
        labels: this.labels,
        datasets: [{
          data: [],
          backgroundColor: this.colors,
          borderColor: 'rgba(255,255,255,0.1)',
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
      this.chart.data.datasets[0].data = this.value.values.map(value => value[this.unit]);
      this.chart.update();
    });
  }
}

export default ChartWidget;
