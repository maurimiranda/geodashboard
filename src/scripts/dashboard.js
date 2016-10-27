import MapManager from './map-manager';
import WidgetManager from './widget-manager';

import template from '../templates/dashboard.hbs';

import '../styles/dashboard.scss';

export default class Dashboard {
  constructor(config) {
    this.header = config.header;
    this.footer = config.footer;
    this.container = config.container;

    this.mapManager = new MapManager(config.map);
    this.widgetManager = new WidgetManager();

    this.mapManager.on('mapchange', (event) => {
      this.extent = event.extent;
      this.refresh();
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
}
