import Layer from './layer';

export default class OverlayLayer extends Layer {
  constructor(config = {}) {
    config.title = config.title || 'OverlayLayer';
    config.visible = config.visible || false;
    super(config);

    this.server = config.server;
    this.layerName = config.layer;
    this.style = config.style;
    this.attribution = config.attribution || '';
    this.exclusive = config.exclusive || false;
  }
}
