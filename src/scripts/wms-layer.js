import OverlayLayer from './overlay-layer';

export default class WMSLayer extends OverlayLayer {
  constructor(config = {}) {
    super(config);
    this.server = `${config.server}/wms/`;

    this.layer = new ol.layer.Image({
      title: this.title,
      visible: this.visible,
      exclusive: this.exclusive,
      zIndex: 1,
    });

    this.source = new ol.source.ImageWMS({
      url: this.server,
      params: {
        LAYERS: this.layerName,
        STYLES: this.style,
      },
      attributions: [new ol.Attribution({
        html: this.attribution,
      })],
    });
  }

  refresh() {
    const params = this.layer.getSource().getParams();
    params.CQL_FILTER = this.manager.filterString;
    this.source.updateParams(params);
  }
}
