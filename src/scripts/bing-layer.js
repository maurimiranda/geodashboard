import BaseLayer from './base-layer';

export default class BingLayer extends BaseLayer {
  constructor(config = {}) {
    config.title = config.title || 'Bing Aerial';
    super(config);

    this.source = new ol.source.BingMaps({
      key: config.key,
      imagerySet: 'Aerial',
    });
  }
}
