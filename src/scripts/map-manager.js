import EventEmitter from 'events';

import WFSLayer from './wfs-layer';

import popupTemplate from '../templates/feature-popup.hbs';

import '../styles/map.scss';

class MapManager extends EventEmitter {
  constructor(config) {
    super();

    this.config = config;

    this._createLayerGroups();
    this._createMap();
    this._createOverlay();
    this._addLayerSwitcher();
    if (this.config.addDefaultBaseLayers) {
      this._addDefaultBaseLayers();
    }
  }

  _createLayerGroups() {
    this.baseLayers = new ol.layer.Group({
      title: 'Base',
      layers: [],
    });
    this.overlayLayers = new ol.layer.Group({
      title: 'Data',
      layers: [],
    });
    this.layers = [this.overlayLayers, this.baseLayers];
  }

  _createMap() {
    this.view = new ol.View({
      center: ol.proj.fromLonLat(this.config.center),
      zoom: this.config.zoom,
    });

    this.map = new ol.Map({
      view: this.view,
      loadTilesWhileInteracting: true,
      interactions: ol.interaction.defaults({ mouseWheelZoom: false }),
      layers: this.layers,
    });

    this.attribution = this.config.attribution;
    this.viewProjection = this.view.getProjection();
    this.viewResolution = this.view.getResolution();

    this.map.on('moveend', e => this.emit('mapchange', e));
  }

  _createOverlay() {
    this.overlay = new ol.Overlay({});
    this.map.addOverlay(this.overlay);
    this.map.on('singleclick', this._featurePopup.bind(this));
  }

  _addLayerSwitcher() {
    this.layerSwitcher = new ol.control.LayerSwitcher({
      tipLabel: 'Layers',
    });
    this.map.addControl(this.layerSwitcher);
    if (this.config.keepLayerSwitcherOpen) {
      this.layerSwitcher.panel.onmouseout = null;
      this.map.on('postrender', () => {
        this.layerSwitcher.showPanel();
      });
    }
  }

  _addDefaultBaseLayers() {
    this.addBingLayer({
      title: 'Bing Aerial',
      key: this.config.bingKey,
    });
    this.addOSMLayer({
      title: 'OpenStreetMap',
    });
  }

  render(container) {
    this.map.setTarget(container);
  }

  addBingLayer(config) {
    const layer = new ol.layer.Tile({
      title: config.title,
      preload: Infinity,
      source: new ol.source.BingMaps({
        key: config.key,
        imagerySet: 'Aerial',
      }),
      visible: false,
      type: 'base',
      zIndex: -1,
    });
    this.baseLayers.getLayers().push(layer);
    return layer;
  }

  addOSMLayer(config) {
    const layer = new ol.layer.Tile({
      title: config.title,
      source: new ol.source.OSM(),
      type: 'base',
      visible: true,
      zIndex: -1,
    });
    this.baseLayers.getLayers().push(layer);
    return layer;
  }

  _featurePopup(event) {
    const pixel = this.map.getEventPixel(event.originalEvent);
    const result = this.map.forEachFeatureAtPixel(pixel, (feature, layer) => ({
      feature,
      layer,
    }));
    if (result && result.feature) {
      const properties = result.layer.featurePopup.map(property => ({
        title: property.title,
        value: property.format ? property.format(result.feature.get(property.property)) :
        result.feature.get(property.property),
      }));
      const element = document.createElement('div');
      element.innerHTML = popupTemplate({
        properties,
      });
      this.map.beforeRender(ol.animation.pan({
        duration: 1000,
        source: this.view.getCenter(),
      }));
      pixel[0] += element.offsetWidth + 100;
      pixel[1] -= element.offsetHeight - 150;
      this.view.setCenter(this.map.getCoordinateFromPixel(pixel));
      this.overlay.setElement(element);
      this.overlay.setPosition(event.coordinate);
    } else {
      this.overlay.setElement(null);
    }
  }

  addWFSLayer(config) {
    const layer = new WFSLayer(Object.assign(config, {
      serverURL: this.config.serverURL,
      viewProjection: this.viewProjection,
    }));
    this.overlayLayers.getLayers().push(layer.layer);
  }
}

module.exports = MapManager;
