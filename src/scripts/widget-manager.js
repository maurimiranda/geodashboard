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
}

export default WidgetManager;
