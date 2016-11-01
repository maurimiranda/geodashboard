import WPSWidget from './wps-widget';

import requestTemplate from '../../templates/widget/wps/count.hbs';

class CountWidget extends WPSWidget {
  constructor(config) {
    super(config);
    this.requestTemplate = requestTemplate;
  }

  parseResponse(value) {
    this.value = value;
  }
}

export default CountWidget;
