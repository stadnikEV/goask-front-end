import BaseComponent from 'components/__shared/base-component';
import ButtonMainEvent from 'components/buttons/button-main-event';
import getTruncateText from 'utils/get-truncate-text';

import './style.scss'; // css
import template from './template.hbs';


export default class MyListItem extends BaseComponent {
  constructor({ el, data }) {
    super({ el });
    this.components = {};
    this.questionId = data._id;

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
  }

  initComponentButtonDetails() {
    this.components.ButtonDetails = new ButtonMainEvent({
      el: this.elements.buttoDetailsContainer,
      className: 'button-main',
      componentName: 'my-question-details',
      eventName: 'question-details',
      data: { questionId: this.questionId },
      value: 'Подробнее',
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
