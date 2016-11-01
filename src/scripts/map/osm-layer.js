import ol from 'openlayers';

import BaseLayer from './base-layer';

export default class OSMLayer extends BaseLayer {
  constructor(config = {}) {
    config.title = config.title || 'OpenStreetMap';
    super(config);

    this.source = new ol.source.OSM();
  }
}
