import BaseComponent from 'components/__shared/base-component';
import SessionTitle from 'components/about/session-title';
import ButtonBack from 'components/buttons/button-main-event';
import Describe from 'components/about/describe';
import StatusQuestion from 'components/questions/status-question';
import './style.scss'; // css
import template from './template.hbs';


export default class MyQuestionsDetails extends BaseComponent {
  constructor({ el, data }) {
    super({ el });
    this.components = {};

    this.data = data;
    this.render(data);

    this.elements.questionDetails = el.querySelector('[data-component="my-question-details"]');
    this.elements.buttonBackContainer = this.elements.questionDetails.querySelector('[data-element="my-question-details__button-back-container"]');
    this.elements.sessionTitleContainer = this.elements.questionDetails.querySelector('[data-element="my-question-details__session-title-container"]');
    this.elements.statusQestionContainer = this.elements.questionDetails.querySelector('[data-element="my-question-details__status-question-container"]');
    this.elements.questionContainer = this.elements.questionDetails.querySelector('[data-element="my-question-details__question-container"]');
    this.elements.sessionContainer = this.elements.questionDetails.querySelector('[data-element="my-question-details__session-container"]');
    this.elements.aboutSpeakerContainer = this.elements.questionDetails.querySelector('[data-element="my-question-details__about-speaker-container"]');

    this.initComponentSessionTitle();
    this.initComponentStatusQuestion();
    this.initComponentQuestion();
    this.initComponentSession();
    this.initComponentAboutSpeaker();
    this.initComponentButtonBack();
  }

  render() {
    this.el.innerHTML = template();
  }

  initComponentSessionTitle() {
    this.components.sessionTitle = new SessionTitle({
      el: this.elements.sessionTitleContainer,
      sessionTheme: this.data.sessionTheme,
      speakerName: this.data.speakerName,
      categoryName: this.data.categoryName,
    });
  }

  initComponentStatusQuestion() {
    this.components.statusQestion = new StatusQuestion({
      el: this.elements.statusQestionContainer,
      status: this.data.status,
    });
  }

  initComponentQuestion() {
    this.components.question = new Describe({
      el: this.elements.questionContainer,
      title: 'Мой вопрос',
      describe: this.data.question,
    });
  }

  initComponentSession() {
    this.components.session = new Describe({
      el: this.elements.sessionContainer,
      title: 'Описание сессии',
      describe: this.data.describeSession,
    });
  }

  initComponentAboutSpeaker() {
    this.components.speaker = new Describe({
      el: this.elements.aboutSpeakerContainer,
      title: 'О спикере',
      describe: this.data.aboutSpeaker,
    });
  }

  initComponentButtonBack() {
    this.components.ButtonBack = new ButtonBack({
      el: this.elements.buttonBackContainer,
      value: 'Назад',
      className: 'button-main',
      componentName: 'button-back',
      eventName: 'back-from-question-details',
    });
  }

  showDetails(data) {
    this.components.sessionTitle.render({
      sessionTheme: data.sessionTheme,
      speakerName: data.speakerName,
      categoryName: data.categoryName,
    });

    this.components.question.render({
      title: 'Мой вопрос',
      describe: data.question,
    });

    this.components.session.render({
      title: 'Описание сессии',
      describe: data.describeSession,
    });

    this.components.speaker.render({
      title: 'О спикере',
      describe: data.aboutSpeaker,
    });
  }
}
