export default class Layer {
  constructor(config = {}) {
    config.title = config.title || 'Layer';
    config.visible = config.visible || false;

    this.title = config.title;
    this.visible = config.visible;
  }

  set source(value) {
    this.layer.setSource(value);
  }

  get source() {
    return this.layer.getSource();
  }
}
