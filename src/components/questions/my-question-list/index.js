import BaseComponent from 'components/__shared/base-component';
import MylistItem from 'components/questions/my-list-item';
import './style.scss'; // css
import template from './template.hbs';


export default class MyQestionsList extends BaseComponent {
  constructor({ el, questions }) {
    super({ el });
    this.components = {};

    this.createQuestionList({ questions });
  }

  createQuestionList({ questions }) {
    this.render({ questions });
    this.elements.MyQuestionsList = document.querySelector('[data-component="my-question-list"]');
    this.initListItems({ questions });
  }

  render({ questions }) {
    this.el.innerHTML = template({ questions });
  }


  initListItems({ questions }) {
    questions.forEach((item) => {
      const elemContainer = this.elements.MyQuestionsList.querySelector(`[data-questionId="${item._id}"][data-element="my-question-list__item-container"]`);
      this.initcomponentListItem({
        el: elemContainer,
        questionId: item._id,
        data: item,
      });
    });
  }

  initcomponentListItem({ el, questionId, data }) {
    this.components[`mylistItem${questionId}`] = new MylistItem({
      el,
      data,
    });
  }
}
