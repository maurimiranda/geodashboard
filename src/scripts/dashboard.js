/* eslint no-bitwise: ["error", { "allow": [">>", "^"] }] */

import MapManager from './map/map-manager';
import WidgetManager from './widget/widget-manager';

import template from '../templates/dashboard.hbs';

import '../styles/dashboard.scss';

/**
 * The main class of GeoDashboard.
 */
class Dashboard {
  /**
   * @param {Object} config - Configuration object
   * @param {HTMLElement} config.container - Element where the dashboard will be placed
   * @param {Object} config.map - Map configuration
   * @param {Number[]} config.map.center - The initial center for the map
   * @param {Number} config.map.zoom - The initial zoom level
   * @param {Object} [config.header] - Header configuration
   * @param {String} config.header.title - Text to show in header
   * @param {String} config.header.logo - URL of image to show in header
   * @param {Object} [config.footer] - Footer configuration
   * @param {String} config.footer.text - Text to show in footer
   * @param {Filter[]} [config.filters] - Set of filters to apply to layers and widgets
   */
  constructor(config) {
    this.container = config.container;
    this.header = config.header;
    this.footer = config.footer;
    this.filters = config.filters || [];

    /**
     * Dashboard MapManager
     * @member {MapManager}
     */
    this.mapManager = new MapManager(config.map);
    this.mapManager.dashboard = this;

    this.mapManager.on('mapchange', (event) => {
      this.extent = event.extent;
      this.refresh();
    });

    /**
     * Dashboard WidgetManager
     * @member {WidgetManager}
     */
    this.widgetManager = new WidgetManager();
    this.widgetManager.dashboard = this;
  }

  /**
  * All filter strings joined by 'AND'
  * @member {String}
  * @readonly
  */
  get filterString() {
    return this.filters.map(filter => filter.toString()).join(' AND ');
  }

  /**
   * Creates the dashboard content and render map and widgets.
   */
  render() {
    this.container.insertAdjacentHTML('beforeend', template({
      header: this.header,
      footer: this.footer,
    }));

    this.mapManager.render(this.container.getElementsByClassName('map')[0]);

    this.widgetManager.container = this.container.getElementsByClassName('widget-panel')[0];
    this.widgetManager.render();
  }

  /**
   * Refresh all layers and widgets
   */
  refresh() {
    this.widgetManager.refresh(this.extent);
  }

  /**
   * Adds base layer to the map
   * @param {BaseLayer} layer - The base layer to be added
   */
  addBaseLayer(layer) {
    this.mapManager.addBaseLayer(layer);
  }

  /**
   * Adds overlay layer to the map
   * @param {OverlayLayer} layer - The overlay layer to be added
   */
  addOverlayLayer(layer) {
    this.mapManager.addOverlayLayer(layer);
  }

  /**
   * Adds widget to the panel
   * @param {Widget} widget - The widget to be added
   */
  addWidget(widget) {
    this.widgetManager.addWidget(widget);
  }

  /**
   * Generate random string to use as unique element ID
   */
  static uid() {
    return Math.random().toString(36).substring(7);
  }
}

export default Dashboard;
