import Layer from './layer';

export default class OverlayLayer extends Layer {
  constructor(config = {}) {
    config.title = config.title || 'OverlayLayer';
    config.visible = config.visible || false;
    super(config);

    this.server = config.server;
    this.layerName = config.layer;
    this.style = config.style;
    this.attribution = config.attribution || '';
    this.exclusive = config.exclusive || false;

    this.filters = config.filters || [];
    this.filters.forEach((filter) => {
      filter.ogcOperator = OverlayLayer.getOgcOperator(filter.operator);
    });
  }

  filter(filters = []) {
    filters.push(...this.filters);
    this.filterString = filters.map(filter =>
      `${filter.property}${(filter.operator) ? filter.operator : '='}'${filter.value}'`
    ).join(' AND ');
  }

  static getOgcOperator(operator) {
    switch (operator) {
      case '<>':
        return 'PropertyIsNotEqualTo';
      case '<':
        return 'PropertyIsLessThan';
      case '<=':
        return 'PropertyIsLessThanOrEqualTo';
      case '>':
        return 'PropertyIsGreaterThan';
      case '>=':
        return 'PropertyIsGreaterThanOrEqualTo';
      case 'like':
        return 'PropertyIsLike';
      default:
        return 'PropertyIsEqualTo';
    }
  }
}
