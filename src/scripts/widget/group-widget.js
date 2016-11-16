import AggregateWidget from './aggregate-widget';

import template from '../../templates/widget/group-widget.hbs';

export default class GroupWidget extends AggregateWidget {
  constructor(config) {
    super(config);
    this.categories = config.categories;
    this.function = 'Count';
    this.template = template;
  }

  format() {
    return this.value;
  }

  parseResponse(value) {
    this.value = value.AggregationResults.map(category => ({
      category: category[0],
      value: parseInt(category[1], 10),
    }));
  }
}
