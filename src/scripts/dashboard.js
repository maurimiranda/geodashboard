import MapManager from './map/map-manager';
import WidgetManager from './widget/widget-manager';

import template from '../templates/dashboard.hbs';

import '../styles/dashboard.scss';

export default class Dashboard {
  constructor(config) {
    this.header = config.header;
    this.footer = config.footer;
    this.container = config.container;

    this.mapManager = new MapManager(config.map);
    this.mapManager.dashboard = this;
    this.widgetManager = new WidgetManager();
    this.widgetManager.dashboard = this;

    this.mapManager.on('mapchange', (event) => {
      this.extent = event.extent;
      this.refresh();
    });

    this.filters = config.filters || [];
    this.filters.forEach((filter) => {
      filter.ogcOperator = Dashboard.getOGCOperator(filter.operator);
    });
  }

  render() {
    this.container.insertAdjacentHTML('beforeend', template({
      header: this.header,
      footer: this.footer,
    }));

    this.mapManager.render(this.container.getElementsByClassName('map')[0]);

    this.widgetManager.container = this.container.getElementsByClassName('widget-panel')[0];
    this.widgetManager.render();
  }

  refresh() {
    this.widgetManager.refresh(this.extent);
  }

  addBaseLayer(layer) {
    this.mapManager.addBaseLayer(layer);
  }

  addOverlayLayer(layer) {
    this.mapManager.addOverlayLayer(layer);
  }

  addWidget(widget) {
    this.widgetManager.addWidget(widget);
  }

  get filterString() {
    return this.filters.map(filter =>
      `${filter.property}${(filter.operator) ? filter.operator : '='}'${filter.value}'`
    ).join(' AND ');
  }

  static getOGCOperator(operator) {
    switch (operator) {
      case '<>':
        return 'PropertyIsNotEqualTo';
      case '<':
        return 'PropertyIsLessThan';
      case '<=':
        return 'PropertyIsLessThanOrEqualTo';
      case '>':
        return 'PropertyIsGreaterThan';
      case '>=':
        return 'PropertyIsGreaterThanOrEqualTo';
      case 'like':
        return 'PropertyIsLike';
      default:
        return 'PropertyIsEqualTo';
    }
  }
}
