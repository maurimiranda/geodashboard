import ol from 'openlayers';

import Layer from './layer';

export default class BaseLayer extends Layer {
  constructor(config = {}) {
    config.title = config.title || 'BaseLayer';
    config.visible = config.visible || true;
    super(config);

    this.layer = new ol.layer.Tile({
      title: this.title,
      preload: Infinity,
      visible: this.visible,
      type: 'base',
      zIndex: -1,
    });
  }
}
