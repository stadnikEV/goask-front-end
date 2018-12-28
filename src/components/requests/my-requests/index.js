import PubSub from 'pubsub-js';
import httpRequest from 'utils/http-request.js';
import BaseComponent from 'components/__shared/base-component';
import MyRequestList from 'components/requests/my-request-list';
import MyTitle from 'components/my-title';
import NavigationPage from 'components/nav-page';
import uploadVideo from 'utils/upload-video.js';
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
    this.eventsPubSub.upload = PubSub.subscribe('button-upload', this.onUpload.bind(this));
    this.eventsPubSub.send = PubSub.subscribe('request-send', this.onSend.bind(this));
    this.eventsPubSub.goToPlay = PubSub.subscribe('request-go-to-play', this.onGoToPlay.bind(this));
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

  onGoToPlay(msg, data) {
    const { questionId } = data;
    window.location.href = `<%publicPathBackEnd%>/play-speaker/${questionId}`;
  }

  onDownload(msg, data) {
    const { questionId } = data;
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = `<%publicPathBackEnd%>/download-video-speaker/${questionId}`;
    link.download = '';
    link.click();
  }

  onUpload(msg, data) {
    const { questionId } = data;
    const input = document.createElement('input');
    input.type = 'file';
    input.classList.add('hidden');
    document.body.appendChild(input);

    const sendFile = (ev) => {
      PubSub.publish(`start-upload-${questionId}`);
      const file = ev.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      uploadVideo({
        formData,
        url: `<%publicPathBackEnd%>/api/upload/${questionId}`,
        progress: this.onUploadProgress.bind(this, questionId),
      })
        .then(() => {
          PubSub.publish(`end-upload-${questionId}`, { status: 'decode' });
        })
        .catch((e) => {
          PubSub.publish(`end-upload-${questionId}`, { status: 'uploadError' });
          console.warn(e);
        });
    };

    input.addEventListener('change', sendFile);

    input.click();
  }

  onUploadProgress(questionId, event) {
    PubSub.publish(`upload-progress-${questionId}`, {
      value: event.loaded,
      max: event.total,
    });
  }

  onSend(msg, data) {
    this.setReadyStatus({ questionId: data.questionId })
      .then(() => {
        PubSub.publish('video-response-sent', { questionId: data.questionId });
      })
      .catch((e) => {
        console.warn(e);
      });
  }

  setRejectStatus({ questionId }) {
    return httpRequest.put({
      url: `<%publicPathBackEnd%>/api/requests/${questionId}/reject`,
    });
  }

  setReadyStatus({ questionId }) {
    return httpRequest.put({
      url: `<%publicPathBackEnd%>/api/requests/${questionId}/ready`,
    });
  }

  getMyRequests({ from, to }) {
    return httpRequest.get({
      url: `<%publicPathBackEnd%>/api/requests?from=${from}&to=${to}`,
    });
  }
}
