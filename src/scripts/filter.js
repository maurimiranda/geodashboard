/**
 * Filter configuration
 */
class Filter {
  /**
   * @param {Object} config - Configuration object
   * @param {String|Filter[]} config.property - Property used to filter data or array of two filter objects for complex filters
   * @param {String} config.value - The value to filter by
   * @param {String} [config.operator='='] - The operator to use in filter. Options: '=', '<>', '<', '<=', '>', '>=', 'like'
   * @param {String} [config.logicalOperator='AND'] - The operator to use between filters. Options: 'AND', 'OR', 'NOT'
   */
  constructor(config) {
    this.property = config.property;
    this.value = config.value;
    this.operator = config.operator || '=';
    this.ogcOperator = Filter.ogcOperator(this.operator);
    this.logicalOperator = config.logicalOperator || 'AND';
    this.ogcLogicalOperator = Filter.ogcLogicalOperator(this.logicalOperator);
    this.simple = !Array.isArray(this.property);
  }

  /**
   * @returns {String}
   */
  toString() {
    if (this.simple) {
      return `(${this.property}${(this.operator)}'${this.value}')`;
    }
    let filter = `(${this.property[0]}`;
    for (let i = 1; i < this.property.length; i++) {
      filter += ` ${this.property[i].logicalOperator} ${this.property[i]}`;
    }
    return `${filter})`;
  }

  /**
   * Execute the filter against a given value
   * @param {*} value - Value to process
   * @returns {Boolean} - Returns true if value matches the filter
   */
  execute(value) {
    if (!this.simple) return true; // TODO: implement complex filters

    switch (this.operator) {
      case '<>':
        return value != this.value; // eslint-disable-line eqeqeq
      case '<':
        return value < this.value;
      case '<=':
        return value <= this.value;
      case '>':
        return value > this.value;
      case '>=':
        return value >= this.value;
      case 'like':
        return value.match(`/^${this.value.replace('%', '.*')}$/`);
      default:
        return value == this.value; // eslint-disable-line eqeqeq
    }
  }

  /**
   * OGC string version of the filter operator
   * @returns {String}
   * @static
   */
  static ogcOperator(operator) {
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

  /**
   * OGC string version of the logical operator
   * @returns {String}
   * @static
   */
  static ogcLogicalOperator(operator) {
    switch (operator.toUpperCase()) {
      case 'NOT':
        return 'Not';
      case 'OR':
        return 'Or';
      default:
        return 'And';
    }
  }
}

export default Filter;
