import AggregateWidget from './aggregate-widget';

import template from '../../templates/widget/group-widget.hbs';

export default class GroupWidget extends AggregateWidget {
  constructor(config) {
    super(config);
    this.group = config.group;
    this.function = 'Count';
    this.template = template;
  }

  format() {
    if (this.customFormat) {
      return this.customFormat(this.value);
    }
    return this.value;
  }

  parseResponse(value) {
    this.value = value.AggregationResults.map(category => ({
      category: category[0],
      value: parseInt(category[1], 10),
    }));
  }
}
