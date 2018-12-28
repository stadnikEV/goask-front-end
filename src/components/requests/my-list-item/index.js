import PubSub from 'pubsub-js';
import BaseComponent from 'components/__shared/base-component';
import ButtonMainEvent from 'components/buttons/button-main-event';
import StatusQuestion from 'components/questions/status-question';
import ProgressBar from 'components/progress-bar';
import getTruncateText from 'utils/get-truncate-text';

import './style.scss'; // css
import template from './template.hbs';


export default class MyListItem extends BaseComponent {
  constructor({ el, data }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};
    this.questionId = data._id;
    this.status = data.status;

    this.render(data);

    this.elements.myListItem = document.querySelector(`[data-component="my-list-item"][data-questionId="${data._id}"]`);
    this.elements.content = this.elements.myListItem.querySelector('[data-element="my-list-item__content"]');
    this.elements.statusQuestionContainer = this.elements.myListItem.querySelector('[data-element="my-list-item__status-question-container"]');
    this.elements.question = this.elements.myListItem.querySelector('[data-element="my-list-item__question"]');
    this.elements.navigation = this.elements.myListItem.querySelector('[data-element="my-list-item__navigation-container"]');
    this.elements.buttoSendContainer = this.elements.myListItem.querySelector('[data-element="my-list-item__button-send-container"]');
    this.elements.buttoPlayContainer = this.elements.myListItem.querySelector('[data-element="my-list-item__button-play-container"]');
    this.elements.buttoUploadContainer = this.elements.myListItem.querySelector('[data-element="my-list-item__button-upload-container"]');
    this.elements.buttoResponseContainer = this.elements.myListItem.querySelector('[data-element="my-list-item__button-response-container"]');
    this.elements.buttoRejectContainer = this.elements.myListItem.querySelector('[data-element="my-list-item__button-reject-container"]');
    this.elements.uploadProgressContainer = this.elements.myListItem.querySelector('[data-element="my-list-item__upload-progress-container"]');

    this.initComponentStatusQuestion({ status: this.status });

    if (this.status !== 'ready'
    && this.status !== 'upload'
    && this.status !== 'decode') {
      this.initComponentButtonReject();
    }

    if (this.status === 'pending'
    || this.status === 'processed'
    || this.status === 'uploadError'
    || this.status === 'decodeError') {
      this.initComponentButtonResponse();
      this.initComponentButtonUpload();
    }

    if (this.status === 'processed') {
      this.initComponentButtonPlay();
      this.initComponentButtonSend();
    }

    if (this.status === 'ready') {
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
    this.eventsPubSub.videoSent = PubSub.subscribe('video-response-sent', this.onVideoSent.bind(this));
    this.eventsPubSub.startUpload = PubSub.subscribe(`start-upload-${this.questionId}`, this.onStartUpload.bind(this));
    this.eventsPubSub.endUpload = PubSub.subscribe(`end-upload-${this.questionId}`, this.onEndUpload.bind(this));
    this.eventsPubSub.uploadProgress = PubSub.subscribe(`upload-progress-${this.questionId}`, this.onUploadProgress.bind(this));
  }

  removeEvents() {
    window.removeEventListener('resize', this.onResize);
    this.unsubscribe();
  }

  initComponentStatusQuestion({ status }) {
    this.components.statusQestion = new StatusQuestion({
      el: this.elements.statusQuestionContainer,
      status,
    });
  }

  initUploadProgress({ value, max }) {
    this.components.uploadProgress = new ProgressBar({
      el: this.elements.uploadProgressContainer,
      value,
      max,
    });
  }

  initComponentButtonSend() {
    this.components.buttonSend = new ButtonMainEvent({
      el: this.elements.buttoSendContainer,
      modifierClassName: 'button-main__button_width-container',
      componentName: 'button-my-request-send',
      eventName: 'request-send',
      data: {
        questionId: this.questionId,
        listItem: this,
      },
      value: 'Отправить',
    });
  }

  initComponentButtonPlay() {
    this.components.buttonPlay = new ButtonMainEvent({
      el: this.elements.buttoPlayContainer,
      modifierClassName: 'button-main__button_width-container',
      componentName: 'button-my-request-play',
      eventName: 'request-go-to-play',
      data: {
        questionId: this.questionId,
        listItem: this,
      },
      value: 'Просмотр',
    });
  }

  initComponentButtonUpload() {
    this.components.buttonUpload = new ButtonMainEvent({
      el: this.elements.buttoUploadContainer,
      modifierClassName: 'button-main__button_width-container',
      componentName: 'button-my-request-upload',
      eventName: 'button-upload',
      data: {
        questionId: this.questionId,
        listItem: this,
      },
      value: 'Загрузить',
    });
  }

  initComponentButtonReject() {
    this.components.buttonReject = new ButtonMainEvent({
      el: this.elements.buttoRejectContainer,
      modifierClassName: 'button-main__button_color-gray button-main__button_width-container',
      componentName: 'button-my-request-reject',
      eventName: 'request-reject',
      data: {
        questionId: this.questionId,
        listItem: this,
      },
      value: 'Отклонить',
    });
  }

  initComponentButtonResponse() {
    const value = (this.status === 'pending')
      ? 'Ответить'
      : 'Перезаписать';

    this.components.buttonResponse = new ButtonMainEvent({
      el: this.elements.buttoResponseContainer,
      componentName: 'button-my-response',
      modifierClassName: 'button-main__button_width-container',
      eventName: 'go-to-response',
      data: {
        questionId: this.questionId,
      },
      value,
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

  onVideoSent(msg, data) {
    if (data.questionId === this.questionId) {
      this.components.statusQestion.setStatus({ status: 'ready' });
      this.components.buttonResponse.destroy();
      this.components.buttonReject.destroy();
      this.components.buttonSend.destroy();
      this.components.buttonUpload.destroy();
      delete this.components.buttonResponse;
      delete this.components.buttonReject;
      delete this.components.buttonSend;
      delete this.components.buttonUpload;
    }
  }

  onStartUpload() {
    this.components.statusQestion.setStatus({ status: 'upload' });
    this.components.buttonResponse.destroy();
    this.components.buttonReject.destroy();
    this.components.buttonUpload.destroy();
    delete this.components.buttonResponse;
    delete this.components.buttonReject;
    delete this.components.buttonUpload;

    if (this.components.buttonSend) {
      this.components.buttonSend.destroy();
      delete this.components.buttonSend;
    }
    if (this.components.buttonPlay) {
      this.components.buttonPlay.destroy();
      delete this.components.buttonPlay;
    }
  }

  onUploadProgress(msg, { value, max }) {
    if (!this.components.uploadProgress) {
      this.initUploadProgress({ value, max });
    }

    if (value === max) {
      setTimeout(() => {
        this.components.uploadProgress.destroy();
        delete this.components.uploadProgress;
      }, 800);

      return;
    }

    this.components.uploadProgress.setValue({ value });
  }

  onEndUpload(msg, data) {
    this.components.statusQestion.setStatus({ status: data.status });
  }


  onResize() {
    this.elements.question.innerHTML = this.str;
    const truncateQuestionText = this.getTruncateDescribeText();

    if (truncateQuestionText) {
      this.elements.question.innerHTML = truncateQuestionText;
    }
  }
}
