import MapManager from './map-manager';
import WidgetManager from './widget-manager';
import dashboardTemplate from '../templates/geo-dashboard.hbs';

import '../styles/geo-dashboard.scss';

class GeoDashboard {
  constructor(config) {
    this.config = config;

    this.mapManager = new MapManager(Object.assign({
      serverURL: this.config.serverURL,
    }, this.config.map));

    this.widgetManager = new WidgetManager({
      map: this.map,
      wpsUrl: `${this.config.serverURL}/wps/`,
      container: this.widgetContainer,
    });

    this.mapManager.on('mapchange', () => this.refresh());
  }

  render(container) {
    container.insertAdjacentHTML('beforeend', dashboardTemplate({
      config: this.config,
    }));

    this.mapManager.render(container.getElementsByClassName('map')[0]);
    this.widgetManager.render(container.getElementsByClassName('panel')[0]);
  }

  refresh() {
    this.widgetManager.refresh();
  }

  addWFSLayer(config) {
    this.mapManager.addWFSLayer(config);
  }
}

module.exports = GeoDashboard;
