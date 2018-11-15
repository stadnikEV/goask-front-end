import BaseComponent from 'components/__shared/base-component';
import ButtonDefault from 'components/buttons/button-default';
import getTruncateText from 'utils/get-truncate-text';

import './style.scss'; // css
import template from './template.hbs';


export default class MyListItem extends BaseComponent {
  constructor({ el, data }) {
    super({ el });
    this.components = {};
    this.sessionId = data.sessionId;

    this.render(data);

    this.elements.myListItem = document.querySelector(`[data-component="my-list-item"][data-questionId="${data._id}"]`);
    this.elements.content = this.elements.myListItem.querySelector('[data-element="my-list-item__content"]');
    this.elements.question = this.elements.myListItem.querySelector('[data-element="my-list-item__question"]');
    this.elements.navigation = this.elements.myListItem.querySelector('[data-element="my-list-item__navigation-container"]');
    this.elements.buttoLoadContainer = this.elements.myListItem.querySelector('[data-element="my-list-item__button-load-container"]');
    this.elements.buttoDetailsContainer = this.elements.myListItem.querySelector('[data-element="my-list-item__button-details-container"]');

    this.initComponentButtonDetails({ data });

    this.onResize = this.onResize.bind(this);
    this.str = this.elements.question.textContent;

    const truncateQuestionText = this.getTruncateDescribeText();
    if (truncateQuestionText) {
      this.elements.question.innerHTML = truncateQuestionText;
    }

    this.addEvents();

    // this.initComponentButtonLoad({ data });
  }

  render(data) {
    this.el.innerHTML = template({
      session: data.session.theme,
      question: data.question,
      questionId: data._id,
      status: this.getStatusText({ status: data.status }),
    });
  }

  addEvents() {
    window.addEventListener('resize', this.onResize);
  }

  removeEvents() {
    window.removeEventListener('resize', this.onResize);
    this.unsubscribe();
  }

  initComponentButtonDetails() {
    this.components.ButtonDetails = new ButtonDefault({
      el: this.elements.buttoDetailsContainer,
      className: 'button-default_color-gray',
      componentName: `button-remove-session-${this.sessionId}`,
      eventName: 'remove-session',
      data: this.sessionId,
      value: 'Подробнее',
    });
  }

  initComponentButtonLoad() {
    this.components.ButtonLoad = new ButtonDefault({
      el: this.elements.buttoLoadContainer,
      className: 'button-default_color-gray',
      componentName: `button-remove-session-${this.sessionId}`,
      eventName: 'remove-session',
      data: this.sessionId,
      value: 'Удалить сессию',
    });
  }

  getStatusText({ status }) {
    if (status === 'pending') {
      return 'Ожидание';
    }
    return 'Ответ Получен';
  }

  getTruncateDescribeText() {
    const containerElemHeight = this.elements.content.clientHeight;
    const innerElementsHeight = this.elements.content.scrollHeight;
    const questionHeight = this.elements.question.clientHeight;

    if (containerElemHeight > innerElementsHeight) {
      return false;
    }
    const newQuestionHeight = containerElemHeight - (innerElementsHeight - questionHeight);
    return getTruncateText({
      el: this.elements.question,
      height: newQuestionHeight,
      width: this.elements.question.clientWidth - this.elements.navigation.clientWidth,
    });
  }


  onResize() {
    this.elements.question.innerHTML = this.str;
    const truncateQuestionText = this.getTruncateDescribeText();

    if (truncateQuestionText) {
      this.elements.question.innerHTML = truncateQuestionText;
    }
  }
}
