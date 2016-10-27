import template from '../templates/widget.hbs';

export default class Widget {
  constructor(config) {
    this.title = config.title;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = template({
      title: this.title,
    });
    this.container = element.firstChild;
    this.manager.container.appendChild(this.container);
    this.refresh();
  }

  refresh() {
    this.container.getElementsByClassName('widget-content')[0].innerHTML = this.template({
      value: this.format(this.value),
    });
  }
}
