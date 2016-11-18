/**
 * Filter configuration
 */
class Filter {
  /**
   * @param {Object} config - Configuration object
   * @param {String} config.property - Property used to filter data
   * @param {String} config.value - The value to filter by
   * @param {String} [config.operator='='] - The operator to use in filter.
   *   Options: '=', '<>', '<', '<=', '>', '>=', 'like'.
   */
  constructor(config) {
    this.property = config.property;
    this.value = config.value;
    this.operator = config.operator || '=';
  }

  /**
   * OGC string version of the filter operator
   * @member {String}
   * @readonly
   */
  get ogcOperator() {
    switch (this.operator) {
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

  /**
   * @returns {String}
   */
  toString() {
    return `${this.property}${(this.operator)}'${this.value}'`;
  }
}

export default Filter;
