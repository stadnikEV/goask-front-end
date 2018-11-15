import BaseComponent from 'components/__shared/base-component';
import getTruncateText from 'utils/get-truncate-text';
import ButtonLink from 'components/buttons/button-link';
import './style.scss'; // css


export default class PublicListItem extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};

    this.elements.item = this.el.querySelector('[data-component="public-session-list-item"]');
    this.elements.content = this.elements.item.querySelector('[data-element="public-session-list-item__content"]');
    this.elements.describeSession = this.elements.item.querySelector('[data-element="public-session-list-item__describe-session"]');
    this.elements.navigation = this.elements.item.querySelector('[data-element="public-session-list-item__navigation"]');
    this.elements.buttonDetailsContainer = this.elements.item.querySelector('[data-element="public-session-list-item__button-session-details-container"]');

    this.elements.describeSession.classList.remove('hidden');
    this.str = this.elements.describeSession.textContent;

    const truncateDescribeText = this.getTruncateDescribeText();

    if (truncateDescribeText) {
      this.elements.describeSession.innerHTML = truncateDescribeText;
    }

    this.onResize = this.onResize.bind(this);

    this.initButtonDetailsComponent();

    this.addEvents();
    // this.elements.buttoRemoveContainer = this.elements.myListItem.querySelector('[data-element="my-list-item__button-remove-container"]');

    // this.initComponentButtonRemove({ data });
  }


  addEvents() {
    window.addEventListener('resize', this.onResize);
  }

  removeEvents() {
    this.unsubscribe();
  }

  getTruncateDescribeText() {
    const contentElemHeight = this.elements.content.clientHeight;
    const innerElementsHeight = this.elements.content.scrollHeight;
    const describeSessionHeight = this.elements.describeSession.clientHeight;

    if (contentElemHeight > innerElementsHeight) {
      return false;
    }
    const newDescribeSessionHeight = contentElemHeight - (innerElementsHeight - describeSessionHeight);

    return getTruncateText({
      el: this.elements.describeSession,
      height: newDescribeSessionHeight,
      width: this.elements.describeSession.clientWidth - this.elements.navigation.offsetWidth,
    });
  }

  onResize() {
    this.elements.describeSession.innerHTML = this.str;
    const truncateDescribeText = this.getTruncateDescribeText();

    if (truncateDescribeText) {
      this.elements.describeSession.innerHTML = truncateDescribeText;
    }
  }

  initButtonDetailsComponent() {
    const sessionId = this.elements.buttonDetailsContainer.getAttribute('data-sessionId');

    this.components.ButtonDetails = new ButtonLink({
      el: this.elements.buttonDetailsContainer,
      componentName: 'button-session-details',
      id: sessionId,
    });
  }

  // initComponentButtonRemove() {
  //   this.components.ButtonRemove = new ButtonDefault({
  //     el: this.elements.buttoRemoveContainer,
  //     className: 'button-default_color-gray',
  //     componentName: `button-remove-session-${this.sessionId}`,
  //     eventName: 'remove-session',
  //     data: this.sessionId,
  //     value: 'Удалить сессию',
  //   });
  // }
}
