import ol from 'openlayers';

import template from '../../templates/map/layer-switcher.hbs';

/**
 * Custom implementation of LayerSwitcher based on [Matt Walker's OL3 control](https://github.com/walkermatt/ol3-layerswitcher)
 */
class LayerSwitcher extends ol.control.Control {
  constructor() {
    const element = document.createElement('div');
    element.className = 'layer-switcher ol-control';

    super({ element });

    this.element = element;
  }

  renderPanel() {
    this.element.innerHTML = template({
      baseLayers: this.manager.baseLayers,
      overlayLayers: this.manager.overlayLayers,
    });
    const inputs = this.element.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i += 1) {
      inputs[i].addEventListener('change', (event) => {
        this.setVisible(this.manager.getLayerById(event.target.id), event.target.checked);
      }, false);
    }
  }

  setMap(map) {
    super.setMap(map);
    this.map = map;
    this.map.on('postrender', () => {
      this.renderPanel();
    });
  }

  setVisible(layer, visible) {
    layer.visible = visible;
    layer.layer.setVisible(visible);
    if (visible) {
      if (layer.base) {
        this.manager.baseLayers.forEach((l) => {
          if (l !== layer) {
            this.setVisible(l, false);
          }
        });
      } else if (layer.exclusive) {
        this.manager.overlayLayers.forEach((l) => {
          if (l !== layer) {
            this.setVisible(l, false);
          }
        });
      }
    }
  }
}

export default LayerSwitcher;
