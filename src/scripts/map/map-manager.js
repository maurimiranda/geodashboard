import EventEmitter from 'events';

import Map from 'ol/map';
import View from 'ol/view';
import Overlay from 'ol/overlay';
import proj from 'ol/proj';
import extent from 'ol/extent';

import LayerSwitcher from './layer-switcher';

import popupTemplate from '../../templates/map/feature-popup.hbs';

/**
 * This class takes care of everything related with the Map.
 */
class MapManager extends EventEmitter {
  /**
   * @param {Object} [config] - Configuration object
   * @param {Number[]} [config.center] - The initial center for the map
   * @param {Number} [config.zoom] - The initial zoom level
   */
  constructor(config = {}) {
    super();

    this.defaultCenter = config.center || [0, 0];
    this.defaultZoom = config.zoom || 1;
    this.baseLayers = [];
    this.overlayLayers = [];

    this.createMap();
    this.createOverlay();
    this.addLayerSwitcher();
  }

  /**
   * Dashboard filter string wrapper
   * @member {String}
   * @readonly
   */
  get filterString() {
    return this.dashboard.filterString;
  }

  /**
   * Dashboard filters array wrapper
   * @member {String}
   * @readonly
   */
  get filters() {
    return this.dashboard.filters;
  }

  /**
   * Creates the [OpenLayers Map](https://openlayers.org/en/latest/apidoc/ol.Map.html) and sets its initial status.
   * @private
   */
  createMap() {
    this.view = new View({
      center: proj.fromLonLat(this.defaultCenter),
      zoom: this.defaultZoom,
    });

    this.map = new Map({
      view: this.view,
      loadTilesWhileInteracting: true,
      layers: this.layers,
    });

    this.viewProjection = this.view.getProjection();
    this.viewResolution = this.view.getResolution();

    this.map.on('moveend', (event) => {
      event.extent = this.map.getView().calculateExtent(this.map.getSize());
      this.emit('mapchange', event);
    });
  }

  /**
   * Creates the [OpenLayers Overlay](https://openlayers.org/en/latest/apidoc/ol.Overlay.html) to show popups.
   * @private
   */
  createOverlay() {
    this.overlay = new Overlay({
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    });
    this.map.addOverlay(this.overlay);
    this.map.on('singleclick', (event) => {
      const pixel = this.map.getEventPixel(event.originalEvent);
      const result = this.map.forEachFeatureAtPixel(pixel, (feature, layer) => ({
        feature,
        layer,
      }));
      if (result) {
        this.showFeaturePopup(result.layer, result.feature);
      } else {
        this.overlay.setElement(null);
      }
    });
  }

  /**
   * Adds the LayerSwitcher control to the map
   * @private
   */
  addLayerSwitcher() {
    this.layerSwitcher = new LayerSwitcher();
    this.layerSwitcher.manager = this;
    this.layerSwitcher.on('layerChanged', () => {
      this.overlay.setElement(null);
    });
    this.map.addControl(this.layerSwitcher);
  }

  /**
   * Renders the map and all its components into the specefied container.
   * @param {HTMLElement} container - The element where the map will be rendered
   */
  render(container) {
    this.map.setTarget(container);
    setTimeout(() => this.map.updateSize(), 100);
  }

  /**
   * Adds a BaseLayer to the map.
   * @param {BaseLayer} layer - The layer to add
   */
  addBaseLayer(layer) {
    layer.manager = this;
    this.baseLayers.push(layer);
    this.map.addLayer(layer.layer);
  }

  /**
   * Adds an OverlayLayer to the map.
   * @param {OverlayLayer} layer - The layer to add
   */
  addOverlayLayer(layer) {
    layer.manager = this;
    this.overlayLayers.push(layer);
    this.map.addLayer(layer.layer);
    layer.on('loaded', () => this.emit('loaded'));
    layer.refresh();
  }

  /**
   * Refreshes all OverLayer layers
   */
  refresh() {
    this.overlayLayers.forEach(layer => layer.refresh());
  }

  /**
   * Map center coordinates
   * @member {Number[]} center
   */
  get center() {
    return this.view.getCenter();
  }

  set center(value) {
    this.overlay.setElement(null);
    this.view.animate({
      center: value,
      duration: 2000,
    });
  }

  /**
   * Map zoom level
   * @member {Number} zoom
   */
  get zoom() {
    return this.view.getZoom();
  }

  set zoom(value) {
    this.overlay.setElement(null);
    this.view.animate({
      zoom: value,
      duration: 1000,
    });
  }

  /**
   * Centers map to definied feature
   * @param {Object} feature - Feature to center
   */
  centerToFeature(feature) {
    this.center = extent.getCenter(feature.getGeometry().getExtent());
  }

  /**
   * Fits map to definied extent
   * @param {Number[]} toExtent - Array of numbers representing an extent: [minx, miny, maxx, maxy]
   */
  fit(toExtent) {
    if (toExtent && toExtent[0] && isFinite(extent[0])) {
      this.view.fit(extent, {
        size: this.map.getSize(),
      });
    }
  }

  /**
   * Fits map to defined layer
   * @param {Layer} layer - Layer to fit in map
   */
  fitToLayer(layer) {
    if (layer) {
      this.fit(layer.source.getExtent());
    }
  }

  /**
   * Displays feature popup with information
   * @param {Object} layer - Layer to show
   * @param {Object} feature - Feature to show
   */
  showFeaturePopup(layer, feature) {
    const properties = layer.popup.map(property => ({
      title: property.title,
      value: property.format ? property.format(feature.get(property.property)) :
      feature.get(property.property),
    }));
    const element = document.createElement('div');
    element.innerHTML = popupTemplate({
      properties,
    });
    const position = extent.getCenter(feature.getGeometry().getExtent());
    this.overlay.setElement(element);
    this.view.animate({
      center: position,
      duration: 1000,
    });
    this.overlay.setPosition(position);
  }

  /**
   * Searches and returns a specifc layer
   * @param {String} id - The layer ID to find
   * @returns {Layer}
   */
  getLayerById(id) {
    let layer = this.baseLayers.find(l => l.id === id);
    if (!layer) {
      layer = this.overlayLayers.find(l => l.id === id);
    }
    return layer;
  }
}

export default MapManager;
