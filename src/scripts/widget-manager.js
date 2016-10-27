import '../styles/widget-manager.scss';

class WidgetManager {
  constructor() {
    this.widgets = [];
  }

  render() {
    this.widgets.forEach((widget) => {
      widget.render();
    });
  }

  refresh(extent) {
    this.extent = extent;
    this.widgets.forEach((widget) => {
      widget.refresh();
    });
  }

  addWidget(widget) {
    widget.manager = this;
    this.widgets.push(widget);
  }

  get filterString() {
    return this.dashboard.filterString;
  }

  get filters() {
    return this.dashboard.filters;
  }
}

export default WidgetManager;
