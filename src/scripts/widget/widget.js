import template from '../../templates/widget/widget.hbs';

export default class Widget {
  constructor(config) {
    this.title = config.title;
    this.id = parseInt(Math.random() * 10000000, 10);
    this.customFormat = config.format || this.format;
  }

  format() {
    return this.value;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = template({
      title: this.title,
    });
    this.container = element.firstChild;
    this.manager.container.appendChild(this.container);
  }

  refresh() {
    this.container.getElementsByClassName('widget-content')[0].innerHTML = this.template({
      id: this.id,
      value: this.customFormat(this.value),
    });
  }
}
