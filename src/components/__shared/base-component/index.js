import PubSub from 'pubsub-js';

export default class BaseComponent {
  constructor({ el }) {
    this.el = el;
    this.elements = {};
  }

  show() {
    this.el.classList.remove('hidden');
    this.el.classList.remove('impotent');
  }

  hide() {
    this.el.classList.add('hidden');
    this.el.classList.add('impotent');
  }

  showElem({ el }) {
    el.classList.remove('hidden');
    el.classList.remove('impotent');
  }

  hideElem({ el }) {
    el.classList.add('hidden');
    el.classList.add('impotent');
  }

  unsubscribe() {
    const evetsNames = Object.keys(this.eventsPubSub);
    evetsNames.forEach((eventName) => {
      PubSub.unsubscribe(this.eventsPubSub[eventName]);
    });
  }

  removeComponent({ componentName }) {
    this.components[componentName].destroy();
    delete this.components[componentName];
  }

  removeAllComponents() {
    if (!this.components) {
      return;
    }
    const componentNames = Object.keys(this.components);
    componentNames.forEach((componentName) => {
      this.removeComponent({ componentName });
    });
  }

  destroy() {
    if (this.removeEvents) {
      this.removeEvents();
    }
    this.removeAllComponents();
    this.el.innerHTML = '';
  }
}
