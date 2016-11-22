/**
 * This class takes care of everything related with the widget panel.
 */
class WidgetManager {
  constructor() {
    this.widgets = [];
  }

  /**
   * Dashboard filter string wrapper
   * @member {String}
   * @readonly
   */
  get filterString() {
    return this.dashboard.filterString;
  }

  /**
   * Dashboard filters array wrapper
   * @member {String}
   * @readonly
   */
  get filters() {
    return this.dashboard.filters;
  }

  /**
   * Renders all panel widgets.
   */
  render() {
    this.widgets.forEach((widget) => {
      widget.render();
    });
  }

  /**
   * Reloads widgets data based on given extent.
   * @param {Number[]} extent - Array of numbers representing an extent: [minx, miny, maxx, maxy]
   */
  refresh(extent) {
    this.extent = extent;
    this.widgets.forEach((widget) => {
      widget.refresh();
    });
  }

  /**
   * Adds widget to the panel.
   * @param {Widget} widget - The widget to add
   */
  addWidget(widget) {
    widget.manager = this;
    this.widgets.push(widget);
  }
}

export default WidgetManager;
