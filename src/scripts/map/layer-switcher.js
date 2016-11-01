/* eslint no-bitwise: ["error", { "allow": [">>", "^"] }] */

import ol from 'openlayers';

export default class LayerSwitcher extends ol.control.Control {
  constructor(options = {}) {
    super(options);

    const tipLabel = options.tipLabel || 'Legend';

    this.mapListeners = [];

    this.hiddenClassName = 'ol-unselectable ol-control layer-switcher';
    this.shownClassName = `${this.hiddenClassName} shown`;

    if (LayerSwitcher.isTouchDevice()) {
      this.hiddenClassName += ' touch';
    }

    const element = document.createElement('div');
    element.className = this.hiddenClassName;

    const button = document.createElement('button');
    button.setAttribute('title', tipLabel);
    element.appendChild(button);

    this.panel = document.createElement('div');
    this.panel.className = 'panel';
    element.appendChild(this.panel);

    button.onmouseover = () => this.showPanel();

    button.onclick = (e = window.event) => {
      this.showPanel();
      e.preventDefault();
    };

    this.panel.onmouseout = (e = window.event) => {
      if (!this.panel.contains(e.toElement || e.relatedTarget)) {
        this.hidePanel();
      }
    };

    ol.control.Control.call(this, {
      element,
      target: options.target,
    });
  }

  showPanel() {
    if (this.element.className !== this.shownClassName) {
      this.element.className = this.shownClassName;
      this.renderPanel();
    }
  }

  hidePanel() {
    if (this.element.className !== this.hiddenClassName) {
      this.element.className = this.hiddenClassName;
    }
  }

  renderPanel() {
    this.ensureTopVisibleBaseLayerShown();

    while (this.panel.firstChild) {
      this.panel.removeChild(this.panel.firstChild);
    }

    const ul = document.createElement('ul');
    this.panel.appendChild(ul);
    this.renderLayers(this.getMap(), ul);
  }

  setMap(map) {
    // Clean up listeners associated with the previous map
    this.mapListeners.forEach((listener) => {
      this.getMap().unByKey(listener);
    });
    this.mapListeners.length = 0;
    // Wire up listeners etc. and store reference to new map
    ol.control.Control.prototype.setMap.call(this, map);
    if (map) {
      this.mapListeners.push(map.on('pointerdown', () => this.hidePanel()));
      this.renderPanel();
    }
  }

  ensureTopVisibleBaseLayerShown() {
    let lastVisibleBaseLyr;
    LayerSwitcher.forEachRecursive(this.getMap(), (l) => {
      if (l.get('type') === 'base' && l.getVisible()) {
        lastVisibleBaseLyr = l;
      }
    });
    if (lastVisibleBaseLyr) this.setVisible(lastVisibleBaseLyr, true);
  }

  setVisible(lyr, visible) {
    const map = this.getMap();
    lyr.setVisible(visible);
    if (visible && lyr.get('type') === 'base') {
      // Hide all other base layers regardless of grouping
      LayerSwitcher.forEachRecursive(map, (l) => {
        if (l !== lyr && l.get('type') === 'base') {
          l.setVisible(false);
        }
      });
    }
    if (visible && lyr.get('exclusive')) {
      // Hide all other exclusive layers regardless of grouping
      LayerSwitcher.forEachRecursive(map, (l) => {
        if (l !== lyr && l.get('exclusive')) {
          l.setVisible(false);
        }
      });
    }
  }

  renderLayer(lyr) {
    const li = document.createElement('li');
    const lyrTitle = lyr.get('title');
    const lyrId = LayerSwitcher.uuid();
    const label = document.createElement('label');

    if (lyr.getLayers && !lyr.get('combine')) {
      li.className = 'group';
      label.innerHTML = lyrTitle;
      li.appendChild(label);
      const ul = document.createElement('ul');
      li.appendChild(ul);

      this.renderLayers(lyr, ul);
    } else {
      li.className = 'layer';
      const input = document.createElement('input');
      if (lyr.get('type') === 'base') {
        input.type = 'radio';
        input.name = 'base';
      } else if (lyr.get('exclusive')) {
        input.type = 'radio';
        input.name = 'exclusive';
      } else {
        input.type = 'checkbox';
      }
      input.id = lyrId;
      input.checked = lyr.get('visible');
      input.onchange = (e) => {
        this.setVisible(lyr, e.target.checked);
      };
      li.appendChild(input);

      label.htmlFor = lyrId;
      label.innerHTML = lyrTitle;
      li.appendChild(label);
    }

    return li;
  }

  renderLayers(lyr, elm) {
    const lyrs = lyr.getLayers().getArray().slice().reverse();
    lyrs.forEach((layer, index) => {
      if (layer.get('title')) {
        elm.appendChild(this.renderLayer(layer, index));
      }
    });
  }

  static forEachRecursive(lyr, fn) {
    lyr.getLayers().forEach((layer, idx, a) => {
      fn(layer, idx, a);
      if (layer.getLayers) {
        LayerSwitcher.forEachRecursive(layer, fn);
      }
    });
  }

  static uuid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, a => (
      (a ^ Math.random() * 16) >> a / 4
    ).toString(16));
  }

  enableTouchScroll(elm) {
    if (LayerSwitcher.isTouchDevice()) {
      let scrollStartPos = 0;
      elm.addEventListener('touchstart', (event) => {
        scrollStartPos = this.scrollTop + event.touches[0].pageY;
      }, false);
      elm.addEventListener('touchmove', (event) => {
        this.scrollTop = scrollStartPos - event.touches[0].pageY;
      }, false);
    }
  }

  static isTouchDevice() {
    try {
      document.createEvent('TouchEvent');
      return true;
    } catch (e) {
      return false;
    }
  }
}
