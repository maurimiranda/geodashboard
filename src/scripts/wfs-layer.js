import Utils from './utils';

class WFSLayer {
  constructor(config) {
    this.config = config;

    this.layer = new ol.layer.Vector({
      title: this.config.title,
      visible: this.config.visible,
      exclusive: this.config.exclusive,
    });

    this.layer.styleConfig = this.config.style;
    this.layer.styleCache = {};
    this.layer.setStyle(this._setStyle.bind(this));
    this.format = new ol.format.GeoJSON();

    this.source = new ol.source.Vector({
      loader: extent => this._loadFeatures(extent),
      strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
        maxZoom: 19,
      })),
      attributions: [new ol.Attribution({
        html: this.config.attribution,
      })],
    });
    this.layer.setSource(this.source);

    // Add filters
    this.layer.filters = [];
    this.layer.filter = this._filter;
    if (this.config.filters) {
      this.config.filters.forEach((filter) => {
        filter.ogcOperator = Utils.getOgcOperator(filter.operator);
      });
      this.layer.filters = config.filters;
      this.layer.filter();
    }

    // Set popup object
    this.layer.featurePopup = this.config.featurePopup;

    // Remove popup when layer is changed
    this.layer.on('change:visible', () => {
      this.overlay.setElement(null);
    });
  }

  _loadFeatures(extent) {
    const params = new URLSearchParams();
    params.append('service', 'WFS');
    params.append('version', '1.0.0');
    params.append('request', 'GetFeature');
    params.append('outputFormat', 'application/json');
    params.append('format_options', 'CHARSET:UTF-8');
    params.append('typename', this.config.layer);
    params.append('srsname', this.config.viewProjection.getCode());
    params.append('cql_filter', this._buildCQLFilter(extent));
    fetch(`${this.config.serverURL}/wfs?${params.toString()}`, {
      mode: 'cors',
    }).then(response => response.json()).then((data) => {
      this.source.addFeatures(this.format.readFeatures(data));
    });
  }

  _setStyle(feature, resolution) {
    const value = feature.get(this.layer.styleConfig.color.property);
    if (!value || !this.layer.styleConfig.color.values[value]) {
      return this._getDefaultStyle();
    }
    if (!this.layer.styleCache[value]) {
      this.layer.styleCache[value] = {};
    }
    if (!this.layer.styleCache[value][resolution]) {
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
      this.layer.styleCache[value][resolution] = new ol.style.Style({
        image: new ol.style.Circle({
          fill: new ol.style.Fill({
            color: ol.color.asArray(this.layer.styleConfig.color.values[value].color),
          }),
          radius,
          stroke: this._getDefaultStroke(),
        }),
        text,
      });
    }
    return [this.layer.styleCache[value][resolution]];
  }

  _getDefaultStroke() {
    if (!this._defaultStroke) {
      this._defaultStroke = new ol.style.Stroke({
        color: [0, 0, 0, 0.5],
        width: 1,
      });
    }
    return this._defaultStroke;
  }

  _getDefaultFill() {
    if (!this._defaultFill) {
      this._defaultFill = new ol.style.Stroke({
        color: [255, 255, 255, 0.5],
        width: 1,
      });
    }
    return this._defaultFill;
  }

  _getDefaultText(radius) {
    if (!this._defaultText) {
      this._defaultText = new ol.style.Text({
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
    return this._defaultText;
  }

  _getDefaultStyle() {
    if (!this._defaultStyle) {
      this._defaultStyle = new ol.style.Style({
        fill: this._getDefaultFill(),
        stroke: this._getDefaultStroke(),
        image: new ol.style.Circle({
          fill: this._getDefaultFill(),
          radius: 10,
          stroke: this._getDefaultStroke(),
        }),
      });
    }
    return [this._defaultStyle];
  }

  _buildCQLFilter(extent) {
    let cqlFilter = `bbox(geom, ${extent.join(',')}, '${this.config.viewProjection.getCode()}')`;
    if (this.layer.filterString) {
      cqlFilter = `${cqlFilter} AND ${this.layer.filterString}`;
    }
    return cqlFilter;
  }

  _filter(filters = []) {
    const newFilters = filters.concat(this.filters);
    if (!newFilters.length) {
      return;
    }
    const oldString = this.filterString;
    this.filterString = newFilters.map(filter => `${filter.property} ${(filter.operator) ? filter.operator : '='} '${filter.value}'`).join(' AND ');
    if (this.filterString !== oldString) {
      this.getSource().clear();
    }
  }

}

module.exports = WFSLayer;
