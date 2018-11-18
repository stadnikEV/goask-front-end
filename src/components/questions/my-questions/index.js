import PubSub from 'pubsub-js';
import httpRequest from 'utils/http-request.js';
import BaseComponent from 'components/__shared/base-component';
import MyQuestionList from 'components/questions/my-question-list';
import MyTitle from 'components/my-title';
import NavigationPage from 'components/nav-page';
import './style.scss'; // css
import template from './template.hbs';


export default class MyQuestions extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.pageNumber = 1;
    this.numberItemsInPage = 5;

    this.render();

    this.elements.myQuestions = el.querySelector('[data-component="my-questions"]');
    this.elements.questionListContainer = this.elements.myQuestions.querySelector('[data-element="my-questions__question-list-container"]');
    this.elements.questionDetailsContainer = this.elements.myQuestions.querySelector('[data-element="my-questions__question-details-container"]');
    this.elements.questionTitleContainer = this.elements.myQuestions.querySelector('[data-element="my-questions__title-container"]');
    this.elements.navigationPageContainer = this.elements.myQuestions.querySelector('[data-element="my-questions__page-navigation-container"]');
    this.elements.questionDetailsContainer = this.elements.myQuestions.querySelector('[data-element="my-questions__question-details-container"]');


    this.getMyQuestions(this.getRangeQuestions())
      .then((response) => {
        this.numberOfQuestions = response.numberOfQuestions;
        this.numberOfPages = parseInt(response.numberOfQuestions / this.numberItemsInPage, 10);
        this.initComponentQuestionTitle();
        this.initComponentQuestionList({ questions: response.questions });

        if (response.questions.length === 0) {
          return;
        }
        this.initComponentNavigationPage();
      })
      .catch((e) => {
        console.warn(e);
      });


    this.addEvents();
  }

  render() {
    this.el.innerHTML = template();
  }

  addEvents() {
    this.eventsPubSub.setNavigationPage = PubSub.subscribe('button-navigation-page', this.onSetPage.bind(this));
    this.eventsPubSub.questionDetails = PubSub.subscribe('question-details', this.onQuestionDetails.bind(this));
  }

  removeEvents() {
    this.unsubscribe();
  }

  getRangeQuestions() {
    const range = {};
    range.from = (this.pageNumber * this.numberItemsInPage) - (this.numberItemsInPage - 1);
    range.to = this.numberItemsInPage * this.pageNumber;

    return range;
  }

  initComponentQuestionTitle() {
    this.components.MyQuestionsTitle = new MyTitle({
      el: this.elements.questionTitleContainer,
      value: 'Заданные мной вопросы',
    });
  }

  initComponentQuestionList({ questions }) {
    this.components.myQuestionList = new MyQuestionList({
      el: this.elements.questionListContainer,
      questions,
    });
  }

  initComponentNavigationPage() {
    this.components.navigationPage = new NavigationPage({
      el: this.elements.navigationPageContainer,
      pageNumber: this.pageNumber,
      numberOfPages: this.numberOfPages,
    });
  }

  onSetPage(msg, data) {
    if (data.pageNumber === this.pageNumber) {
      return;
    }
    this.pageNumber = data.pageNumber;

    this.getMyQuestions(this.getRangeQuestions())
      .then((response) => {
        this.components.myQuestionList.createQuestionList({ questions: response.questions });

        this.numberOfQuestions = response.numberOfQuestions;
        this.numberOfPages = parseInt(response.numberOfQuestions / this.numberItemsInPage, 10);

        this.removeComponent({ componentName: 'navigationPage' });
        this.initComponentNavigationPage();
      })
      .catch((e) => {
        console.warn(e);
      });
  }

  onQuestionDetails(msg, data) {
    this.getQuestionsDetails(data)
      .then((response) => {
        this.components.MyQuestionsTitle.hide();
        this.components.myQuestionList.hide();
        this.components.navigationPage.hide();

        if (this.components.questionDetails) {
          this.components.questionDetails.show();
          return;
        }
        import('components/questions/my-questions-details' /* webpackChunkName: "questionDetails" */)
          .then((Module) => {
            const QuestionDetails = Module.default;
            this.components.questionDetails = new QuestionDetails({
              el: this.elements.questionDetailsContainer,
              data: response,
            });
          })
          .catch((e) => {
            console.warn(e);
          });
      })
      .catch((e) => {
        console.warn(e);
      });
  }

  getMyQuestions({ from, to }) {
    return httpRequest.get({
      url: `<%publicPathBackEnd%>/api/questions?from=${from}&to=${to}`,
    });
  }

  getQuestionsDetails(data) {
    return httpRequest.get({
      url: `<%publicPathBackEnd%>/api/questions/${data.questionId}`,
    });
  }
}
