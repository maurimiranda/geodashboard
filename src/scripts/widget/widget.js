import Dashboard from '../dashboard';
import template from '../../templates/widget/widget.hbs';

/**
 * Base class for any kind of widget
 */
class Widget {
  /**
   * @param {Object} config - Configuration object
   * @param {String} config.title - Widget title
   * @param {Function} [config.format] - Function to parse and transform data fetched from server.
   *   This function should return a human friendly value as it will be shown as
   *   the widget current value.
   */
  constructor(config) {
    this.title = config.title;
    this.id = Dashboard.uid();
    this.customFormat = config.format || this.format;
  }

  /**
   * Processes the widget value and returns a human friendly version.
   * @returns {Object} - Current widget value prepared to be shown
   * @protected
   */
  format() {
    return this.value;
  }

  /**
   * Renders the widget layout.
   */
  render() {
    const element = document.createElement('div');
    element.innerHTML = template({
      id: this.id,
      title: this.title,
      className: this.className,
    });
    this.container = element.firstChild;
    [this.content] = this.container.getElementsByClassName('widget-content');
    this.manager.container.appendChild(this.container);
  }

  /**
   * Reloads the widget value using the formatted value.
   */
  refresh() {
    this.content.innerHTML = this.template({
      id: this.id,
      value: this.customFormat(this.value),
    });
  }
}

export default Widget;
