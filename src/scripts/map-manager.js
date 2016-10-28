import EventEmitter from 'events';
import ol from 'openlayers';

import popupTemplate from '../templates/feature-popup.hbs';

import '../styles/map-manager.scss';

export default class MapManager extends EventEmitter {
  constructor(config) {
    super();

    this.center = config.center || [0, 0];
    this.zoom = config.zoom || 10;

    this.createLayerGroups();
    this.createMap();
    this.createOverlay();
    this.addLayerSwitcher();
  }

  createLayerGroups() {
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

  createOverlay() {
    this.overlay = new ol.Overlay({});
    this.map.addOverlay(this.overlay);
    this.map.on('singleclick', this.featurePopup.bind(this));
  }

  addLayerSwitcher() {
    this.layerSwitcher = new ol.control.LayerSwitcher({
      tipLabel: 'Layers',
    });
    this.map.addControl(this.layerSwitcher);
    this.layerSwitcher.panel.onmouseout = null;
    this.map.on('postrender', () => {
      this.layerSwitcher.showPanel();
    });
  }

  render(container) {
    this.map.setTarget(container);
    setTimeout(() => this.map.updateSize(), 100);
  }

  addBaseLayer(layer) {
    layer.manager = this;
    this.baseLayers.getLayers().push(layer.layer);
  }

  addOverlayLayer(layer) {
    layer.manager = this;
    layer.refresh();
    this.overlayLayers.getLayers().push(layer.layer);
  }

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

  get filterString() {
    return this.dashboard.filterString;
  }

  get filters() {
    return this.dashboard.filters;
  }
}
