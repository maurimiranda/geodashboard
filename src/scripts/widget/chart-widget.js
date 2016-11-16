import Chart from 'chart.js';

import GroupWidget from './group-widget';

import template from '../../templates/widget/chart-widget.hbs';

export default class ChartWidget extends GroupWidget {
  constructor(config) {
    super(config);
    this.template = template;
    this.labels = Object.getOwnPropertyNames(this.categories.values);
    this.colors = this.labels.map((label => this.categories.values[label].color));
  }

  render() {
    super.render();
    this.container.getElementsByClassName('widget-content')[0].innerHTML = this.template({
      id: this.id,
      value: this.customFormat(this.value),
    });
    this.chart = new Chart(document.getElementById(this.id), {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          backgroundColor: this.colors,
        }],
      },
      options: {
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
      },
    });
  }

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

  parseResponse(value) {
    this.value = this.labels.map((category) => {
      const categoryResult = value.AggregationResults.filter(result =>
        result[0] === category
      );
      return categoryResult.length ? categoryResult[0][1] : 0;
    });
  }
}
