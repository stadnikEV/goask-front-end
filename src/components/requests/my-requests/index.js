import PubSub from 'pubsub-js';
import httpRequest from 'utils/http-request.js';
import BaseComponent from 'components/__shared/base-component';
import MyRequestList from 'components/requests/my-request-list';
import MyTitle from 'components/my-title';
import NavigationPage from 'components/nav-page';
import './style.scss'; // css
import template from './template.hbs';


export default class MyRequests extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.pageNumber = 1;
    this.numberItemsInPage = 5;

    this.render();

    this.elements.myRequests = el.querySelector('[data-component="my-requests"]');
    this.elements.requestTitleContainer = this.elements.myRequests.querySelector('[data-element="my-requests__title-container"]');
    this.elements.requestListContainer = this.elements.myRequests.querySelector('[data-element="my-requests__request-list-container"]');
    this.elements.navigationPageContainer = this.elements.myRequests.querySelector('[data-element="my-requests__page-navigation-container"]');


    this.getMyRequests(this.getRangeRequests())
      .then((response) => {
        this.numberOfRequests = response.numberOfRequests;
        this.numberOfPages = this.getNumbersOfPages();

        this.initComponentRequestTitle();
        this.initComponentRequestList({ requests: response.requests });

        if (this.numberOfRequests <= this.numberItemsInPage) {
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
    this.eventsPubSub.requestReject = PubSub.subscribe('request-reject', this.onRequestReject.bind(this));
    this.eventsPubSub.goToResponse = PubSub.subscribe('go-to-response', this.onGoToResponse.bind(this));
  }

  removeEvents() {
    this.unsubscribe();
  }

  getRangeRequests() {
    const range = {};
    range.from = (this.pageNumber * this.numberItemsInPage) - (this.numberItemsInPage - 1);
    range.to = this.numberItemsInPage * this.pageNumber;

    return range;
  }

  getNumbersOfPages() {
    return Math.ceil(this.numberOfRequests / this.numberItemsInPage);
  }

  initComponentRequestTitle() {
    this.components.MyRequestsTitle = new MyTitle({
      el: this.elements.requestTitleContainer,
      value: 'Вопросы заданные мне',
    });
  }

  initComponentRequestList({ requests }) {
    this.components.myRequestList = new MyRequestList({
      el: this.elements.requestListContainer,
      requests,
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

    this.getMyRequests(this.getRangeRequests())
      .then((response) => {
        this.components.myRequestList.createRequestList({ requests: response.requests });

        this.numberOfRequests = response.numberOfRequests;
        this.numberOfPages = this.getNumbersOfPages();

        this.removeComponent({ componentName: 'navigationPage' });
        this.initComponentNavigationPage();
      })
      .catch((e) => {
        console.warn(e);
      });
  }

  onRequestReject(msg, data) {
    this.setRejectStatus({ questionId: data.questionId })
      .then(() => {
        data.listItem.destroy();
      })
      .catch((e) => {
        console.warn(e);
      });
  }

  onGoToResponse(msg, data) {
    const { questionId } = data;
    window.location.href = `<%publicPathBackEnd%>/stream/${questionId}`;
  }

  setRejectStatus({ questionId }) {
    return httpRequest.put({
      url: `<%publicPathBackEnd%>/api/requests/${questionId}/status`,
      options: {
        data: {
          status: 'reject',
        },
      },
    });
  }

  getMyRequests({ from, to }) {
    return httpRequest.get({
      url: `<%publicPathBackEnd%>/api/requests?from=${from}&to=${to}`,
    });
  }
}
