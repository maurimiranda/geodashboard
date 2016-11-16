import Widget from './widget';

import template from '../../templates/widget/wps-widget.hbs';

export default class WPSWidget extends Widget {
  constructor(config) {
    super(config);

    this.layerName = config.layer;
    this.server = `${config.server}/wps/`;
    this.template = template;
  }

  format() {
    return parseInt(this.value, 10);
  }

  refresh() {
    if (!this.manager.extent) {
      return;
    }

    this.getData((data) => {
      this.parseResponse(data);
      super.refresh();
    });
  }

  getData(callback) {
    fetch(this.server, {
      method: 'POST',
      body: this.requestTemplate({
        layer: this.layerName,
        property: this.property,
        function: this.function,
        category: this.categories ? this.categories.property : null,
        extent: this.manager.extent,
        filters: this.manager.filters,
      }),
      headers: new Headers({
        'Content-Type': 'text/xml',
      }),
    }).then(response => response.json()).then(callback);
  }
}
