import BaseComponent from 'components/__shared/base-component';
import ButtonMainEvent from 'components/buttons/button-main-event';
import StatusQuestion from 'components/questions/status-question';
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
    this.elements.statusQuestionContainer = this.elements.myListItem.querySelector('[data-element="my-list-item__status-question-container"]');
    this.elements.question = this.elements.myListItem.querySelector('[data-element="my-list-item__question"]');
    this.elements.navigation = this.elements.myListItem.querySelector('[data-element="my-list-item__navigation-container"]');
    this.elements.buttonPlayContainer = this.elements.myListItem.querySelector('[data-element="my-list-item__button-play-container"]');
    this.elements.buttonDetailsContainer = this.elements.myListItem.querySelector('[data-element="my-list-item__button-details-container"]');

    this.initComponentStatusQuestion({ status: data.status });
    this.initComponentButtonDetails();

    if (data.status === 'ready') {
      this.initComponentButtonPlay();
    }

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
    });
  }

  addEvents() {
    window.addEventListener('resize', this.onResize);
  }

  removeEvents() {
    window.removeEventListener('resize', this.onResize);
  }

  initComponentStatusQuestion({ status }) {
    this.components.statusQestion = new StatusQuestion({
      el: this.elements.statusQuestionContainer,
      status,
    });
  }

  initComponentButtonDetails() {
    this.components.ButtonDetails = new ButtonMainEvent({
      el: this.elements.buttonDetailsContainer,
      modifierClassName: 'button-main__button_width-container button-main__button_color-gray',
      componentName: 'my-question-details',
      eventName: 'question-details',
      data: { questionId: this.questionId },
      value: 'Подробнее',
    });
  }

  initComponentButtonPlay() {
    this.components.buttonPlay = new ButtonMainEvent({
      el: this.elements.buttonPlayContainer,
      modifierClassName: 'button-main__button_width-container',
      componentName: 'button-my-question-play',
      eventName: 'question-go-to-play',
      data: {
        questionId: this.questionId,
        listItem: this,
      },
      value: 'Просмотр',
    });
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
