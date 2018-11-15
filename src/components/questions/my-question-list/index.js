import PubSub from 'pubsub-js';
import httpRequest from 'utils/http-request.js';
import BaseComponent from 'components/__shared/base-component';
import MylistItem from 'components/questions/my-list-item';
import './style.scss'; // css
import template from './template.hbs';


export default class MyQestionsList extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};
    this.numberItemsInPage = 5;

    this.createQuestionList({
      from: 1,
      to: this.numberItemsInPage,
    })
      .then(() => {
        // this.addEvents();
      })
      .catch((e) => {
        console.warn(e);
      });
  }

  render({ questions }) {
    this.el.innerHTML = template({ questions });
  }

  addEvents() {
    this.eventsPubSub.removeSession = PubSub.subscribe('remove-session', this.onRemoveSesion.bind(this));
  }

  removeEvents() {
    this.unsubscribe();
  }

  getMyQuestions({ from, to }) {
    return httpRequest.get({
      url: `<%publicPathBackEnd%>/api/questions?from=${from}&to=${to}`,
    });
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

  createQuestionList({ from, to }) {
    const promise = new Promise((resolve, reject) => {
      this.getMyQuestions({ from, to })
        .then((response) => {
          this.render({ questions: response.questions });
          this.elements.MyQuestionsList = document.querySelector('[data-component="my-question-list"]');
          this.initListItems({ questions: response.questions });
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
    return promise;
  }

  // onRemoveSesion(msg, sessionId) {
  //   return httpRequest.delete({
  //     url: `<%publicPathBackEnd%>/api/sessions/${sessionId}`,
  //   })
  //     .then(() => {
  //       this.components[`mylistItem${sessionId}`].destroy();
  //       this.components[`mylistItem${sessionId}`] = null;
  //     })
  //     .catch((e) => {
  //       console.warn(e);
  //     });
  // }
}
