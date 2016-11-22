import EventEmitter from 'events';
import ol from 'openlayers';

import LayerSwitcher from './layer-switcher';

import popupTemplate from '../../templates/map/feature-popup.hbs';

/**
 * This class takes care of everything related with the Map.
 */
class MapManager extends EventEmitter {
  /**
   * @param {Object} config - Configuration object
   * @param {Number[]} config.center - The initial center for the map
   * @param {Number} config.zoom - The initial zoom level
   */
  constructor(config) {
    super();

    this.center = config.center || [0, 0];
    this.zoom = config.zoom || 10;
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
    this.view = new ol.View({
      center: ol.proj.fromLonLat(this.center),
      zoom: this.zoom,
    });

    this.map = new ol.Map({
      view: this.view,
      loadTilesWhileInteracting: true,
      interactions: ol.interaction.defaults({ mouseWheelZoom: false }),
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
    this.overlay = new ol.Overlay({});
    this.map.addOverlay(this.overlay);
    this.map.on('singleclick', this.featurePopup.bind(this));
  }

  /**
   * Adds the LayerSwitcher control to the map
   * @private
   */
  addLayerSwitcher() {
    this.layerSwitcher = new LayerSwitcher();
    this.layerSwitcher.manager = this;
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
    layer.refresh();
  }

  /**
   * Popup handler.
   * @param {Event} event - The event object triggered by user interaction
   */
  featurePopup(event) {
    const pixel = this.map.getEventPixel(event.originalEvent);
    const result = this.map.forEachFeatureAtPixel(pixel, (feature, layer) => ({
      feature,
      layer,
    }));
    if (result && result.feature) {
      const properties = result.layer.popup.map(property => ({
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
