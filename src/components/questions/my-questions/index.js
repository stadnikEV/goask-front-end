import PubSub from 'pubsub-js';
import httpRequest from 'utils/http-request.js';
import BaseComponent from 'components/__shared/base-component';
import MyQuestionList from 'components/questions/my-question-list';
import MyTitle from 'components/my-title';
import NavigationPage from 'components/navigations/nav-page';
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
        this.numberOfPages = this.getNumbersOfPages();
        this.initComponentQuestionTitle();
        this.initComponentQuestionList({ questions: response.questions });

        if (this.numberOfQuestions <= this.numberItemsInPage) {
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
    this.eventsPubSub.setNavigationPage = PubSub.subscribe('back-from-question-details', this.onBackFromDetails.bind(this));
    this.eventsPubSub.goToPlay = PubSub.subscribe('question-go-to-play', this.onGoToPlay.bind(this));
  }

  removeEvents() {
    this.unsubscribe();
  }

  getNumbersOfPages() {
    return Math.ceil(this.numberOfQuestions / this.numberItemsInPage);
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
        this.numberOfPages = this.getNumbersOfPages();

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
        if (this.components.navigationPage) {
          this.components.navigationPage.hide();
        }

        if (this.components.questionDetails) {
          this.components.questionDetails.show();
          this.components.questionDetails.showDetails(response);
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

  onDownload(msg, data) {
    const { questionId } = data;
    const link = document.createElement('a');
    link.href = `<%publicPathBackEnd%>/download-video-user/${questionId}`;
    link.download = true;
    link.click();
  }

  onBackFromDetails() {
    this.components.MyQuestionsTitle.show();
    this.components.myQuestionList.show();
    this.components.questionDetails.hide();
    if (this.components.navigationPage) {
      this.components.navigationPage.show();
    }
  }

  getMyQuestions({ from, to }) {
    return httpRequest.get({
      url: `<%publicPathBackEnd%>/api/questions?from=${from}&to=${to}`,
    });
  }

  onGoToPlay(msg, data) {
    const { questionId } = data;
    window.location.href = `<%publicPathBackEnd%>/play-user/${questionId}`;
  }

  getQuestionsDetails(data) {
    return httpRequest.get({
      url: `<%publicPathBackEnd%>/api/questions/${data.questionId}`,
    });
  }
}
