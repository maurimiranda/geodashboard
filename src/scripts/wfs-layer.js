import OverlayLayer from './overlay-layer';

export default class WFSLayer extends OverlayLayer {
  constructor(config = {}) {
    super(config);

    this.server = `${config.server}/wfs/`;
    this.format = new ol.format.GeoJSON();
    this.style = config.style;
    this.styleCache = {};

    this.layer = new ol.layer.Vector({
      title: this.title,
      visible: this.visible,
      exclusive: this.exclusive,
    });
    this.layer.setStyle(this.setStyle.bind(this));

    this.source = new ol.source.Vector({
      loader: this.loadFeatures.bind(this),
      strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
        maxZoom: 19,
      })),
      attributions: [new ol.Attribution({
        html: this.attribution,
      })],
    });

    this.layer.popup = config.popup;
  }

  loadFeatures(extent) {
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
    }).then(response => response.json()).then((data) => {
      this.source.addFeatures(this.format.readFeatures(data));
    });
  }

  refresh() {
    this.source.clear();
  }

  setStyle(feature, resolution) {
    const value = feature.get(this.style.color.property);
    if (!value || !this.style.color.values[value]) {
      return this.getDefaultStyle();
    }
    if (!this.styleCache[value]) {
      this.styleCache[value] = {};
    }
    if (!this.styleCache[value][resolution]) {
      const radius = Math.min(Math.max(3, Math.ceil(40 / Math.log(Math.ceil(resolution)))), 20);
      let text;
      if (resolution < 100) {
        text = new ol.style.Text({
          fill: new ol.style.Fill({
            color: '#005D93',
          }),
          stroke: new ol.style.Stroke({
            color: '#fff',
            width: 3,
          }),
          text: value,
          font: `${radius}px`,
        });
      }
      this.styleCache[value][resolution] = new ol.style.Style({
        image: new ol.style.Circle({
          fill: new ol.style.Fill({
            color: ol.color.asArray(this.style.color.values[value].color),
          }),
          radius,
          stroke: this.getDefaultStroke(),
        }),
        text,
      });
    }
    return [this.styleCache[value][resolution]];
  }

  getDefaultStroke() {
    if (!this.defaultStroke) {
      this.defaultStroke = new ol.style.Stroke({
        color: [0, 0, 0, 0.5],
        width: 1,
      });
    }
    return this.defaultStroke;
  }

  getDefaultFill() {
    if (!this.defaultFill) {
      this.defaultFill = new ol.style.Stroke({
        color: [255, 255, 255, 0.5],
        width: 1,
      });
    }
    return this.defaultFill;
  }

  getDefaultText(radius) {
    if (!this.defaultText) {
      this.defaultText = new ol.style.Text({
        offsetY: radius * 1.5,
        fill: new ol.style.Fill({
          color: '#666',
        }),
        stroke: new ol.style.Stroke({
          color: '#fff',
          width: 2,
        }),
      });
    }
    return this.defaultText;
  }

  getDefaultStyle() {
    if (!this.defaultStyle) {
      this.defaultStyle = new ol.style.Style({
        fill: this.getDefaultFill(),
        stroke: this.getDefaultStroke(),
        image: new ol.style.Circle({
          fill: this.getDefaultFill(),
          radius: 10,
          stroke: this.getDefaultStroke(),
        }),
      });
    }
    return [this.defaultStyle];
  }

  buildCQLFilter(extent) {
    let cqlFilter = `bbox(geom, ${extent.join(',')}, '${this.manager.viewProjection.getCode()}')`;
    if (this.manager.filterString) {
      cqlFilter = `${cqlFilter} AND ${this.manager.filterString}`;
    }
    return cqlFilter;
  }
}
