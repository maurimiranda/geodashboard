import WidgetManager from './widget-manager';
import dashboardTemplate from '../templates/geo-dashboard.hbs';
import popupTemplate from '../templates/feature-popup.hbs';

import '../styles/geo-dashboard.scss';

class GeoDashboard {
  constructor(config) {
    this.config = config;

    this.container = this.config.container;
    this.mapContainer = this.container.getElementsByClassName('map');
    this.widgetContainer = this.container.getElementsByClassName('panel');

    this.widgetManager = new WidgetManager();
    this.geoserverUrl = this.config.geoserverUrl;

      // if (config.hideHeader) {
      //   this.container.find('.geo-dashboard .header').hide();
      //   this.container.find('.geo-dashboard .content').css('top', '0');
      // }

      // if (config.hidePanel) {
      //   this.container.find('.geo-dashboard .content .panel').hide();
      //   this.container.find('.geo-dashboard .content .map').css('width', '100%');
      // }

      // this.picturesUrl = config.picturesUrl;
    // }

    this.container.insertAdjacentHTML('beforeend', dashboardTemplate({
      title: this.config.title,
      logo: this.config.logoUrl,
    }));

    this._createMap(config);
    // this._createWidgetPanel(config);
  }

  _createMap() {
    // Create layer groups
    this.baseLayers = new ol.layer.Group({
      title: 'Base',
      layers: [],
    });
    this.overlayLayers = new ol.layer.Group({
      title: 'Data',
      layers: [],
    });
    this.layers = [this.overlayLayers, this.baseLayers];

    // Create View and Map objects
    this.view = new ol.View({
      center: ol.proj.fromLonLat(this.config.center),
      zoom: this.config.zoom,
    });
    this.map = new ol.Map({
      target: this.mapContainer[0],
      view: this.view,
      loadTilesWhileInteracting: true,
      interactions: ol.interaction.defaults({ mouseWheelZoom: false }),
      layers: this.layers,
    });
    this.attribution = this.config.attribution;
    this.viewProjection = this.view.getProjection();
    this.viewResolution = this.view.getResolution();

    // Add overlay to display info popups
    this.overlay = new ol.Overlay({});
    this.map.addOverlay(this.overlay);

    // Add layer switcher control
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

    // Bind feature popup to map click event
    this.map.on('singleclick', this._featurePopup.bind(this));

    // Add base layers
    if (this.config.addDefaultBaseLayers) {
      this.addBingLayer({
        title: 'Bing Aerial',
        key: this.config.bingKey,
      });
      this.addOSMLayer({
        title: 'OpenStreetMap',
      });
    }
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
      const element = document.createElement(popupTemplate({
        properties,
      }));
      this.map.beforeRender(ol.animation.pan({
        duration: 1000,
        source: this.view.getCenter(),
      }));
      pixel[0] += element.width() + 100;
      pixel[1] -= element.height() - 150;
      this.view.setCenter(this.map.getCoordinateFromPixel(pixel));
      this.overlay.setElement(element[0]);
      this.overlay.setPosition(event.coordinate);
    } else {
      this.overlay.setElement(null);
    }
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
}

module.exports = GeoDashboard;
