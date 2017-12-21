import GeoJSON from 'ol/format/geojson';
import Heatmap from 'ol/layer/heatmap';
import VectorSource from 'ol/source/vector';
import Attribution from 'ol/attribution';
import loadingstrategy from 'ol/loadingstrategy';
import tilegrid from 'ol/tilegrid';

import OverlayLayer from './overlay-layer';

/**
 * Vector Heatmap Layer
 * @extends OverlayLayer
 */
class HeatmapLayer extends OverlayLayer {
  /**
   * @param {Object} config - Configuration object
   * @param {String} [config.title='OverlayLayer'] - Layer title
   * @param {Boolean} [config.visible=false] - Layer initial status
   * @param {String} config.server - URL of map server
   * @param {String} config.layerName - Name of layer to display
   * @param {String} [config.attribution=''] - Layer data attribution
   * @param {Boolean} [config.exclusive=false] - If true, when the layer is shown,
   *   all other overlay layers are hidden
   * @param {Object} [config.blur=15] - Blur size in pixels
   * @param {Object} [config.radius=8] - Radius size in pixels
   */
  constructor(config = {}) {
    super(config);

    this.blur = config.blur || 15;
    this.radius = config.radius || 8;

    this.server = `${config.server}/wfs/`;
    this.format = new GeoJSON();

    this.layer = new Heatmap({
      title: this.title,
      visible: this.visible,
      exclusive: this.exclusive,
      blur: this.blur,
      radius: this.radius,
      gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#fa0', '#f00'],
      opacity: 0.6,
    });

    this.source = new VectorSource({
      loader: this.loadFeatures.bind(this),
      strategy: loadingstrategy.tile(tilegrid.createXYZ({
        maxZoom: 19,
      })),
      attributions: [new Attribution({
        html: this.attribution,
      })],
    });
  }

  /**
   * Reloads layer data using current filters
   */
  refresh() {
    this.source.clear();
  }

  /**
   * Loads features from server via WFS service
   * @param {Number[]} extent - Array of numbers representing an extent: [minx, miny, maxx, maxy]
   * @private
   */
  loadFeatures(extent) {
    this.loading += 1;
    const params = new URLSearchParams();
    params.append('service', 'WFS');
    params.append('version', '1.0.0');
    params.append('request', 'GetFeature');
    params.append('outputFormat', 'application/json');
    params.append('format_options', 'CHARSET:UTF-8');
    params.append('typename', this.layerName);
    params.append('srsname', this.manager.viewProjection.getCode());
    params.append('cql_filter', this.buildCQLFilter(extent));
    fetch(`${this.server}?${params.toString()}`, {
      mode: 'cors',
    }).then(response => response.json())
      .catch(() => null)
      .then((data) => {
        if (data) {
          this.source.addFeatures(this.format.readFeatures(data));
        }
        this.loading -= 1;
        if (this.loading === 0) {
          this.emit('loaded');
        }
      });
  }

  buildCQLFilter(extent) {
    let cqlFilter = `bbox(geom, ${extent.join(',')}, '${this.manager.viewProjection.getCode()}')`;
    if (this.manager.filterString) {
      cqlFilter = `${cqlFilter} AND ${this.manager.filterString}`;
    }
    return cqlFilter;
  }
}

export default HeatmapLayer;
