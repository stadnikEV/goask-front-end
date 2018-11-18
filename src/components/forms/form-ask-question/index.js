import PubSub from 'pubsub-js';
import BaseComponent from 'components/__shared/base-component';
import TipInline from 'components/tip-inline';
import Textarea from 'components/inputs/textarea';
import ButtonSubmit from 'components/buttons/button-submit';
import 'components/__shared/form/style.scss'; // css
import './style.scss'; // css
import getValidationMessage from './get-validation-message';
import template from './template.hbs'; // template


export default class FormAskQuestion extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};

    this.render();

    this.elements.form = document.querySelector('[data-component="form-ask-question"]');
    this.elements.tipAskContainer = this.elements.form.querySelector('[data-element="form-ask-question__tip-ask-container"]');
    this.elements.askContainer = this.elements.form.querySelector('[data-element="form-ask-question__ask-container"]');
    this.elements.buttonSubmitContainer = this.elements.form.querySelector('[data-element="form-ask-question__submit-container"]');

    this.initComponentInputAsk();
    this.initComponentTipAsk();
    this.initComponentButtonSubmit();

    this.onClick = this.onClick.bind(this);
    this.addEvents();
  }

  render() {
    this.el.innerHTML = template();
  }


  addEvents() {
    this.elements.form.addEventListener('click', this.onClick);
  }


  removeEvents() {
    this.elements.form.removeEventListener('click', this.onClick);
  }


  onClick(e) {
    const submit = e.target.closest('[data-component="button-submit-ask"]');

    if (!submit) {
      return;
    }
    if (!this.elements.form.contains(submit)) {
      return;
    }
    e.preventDefault(); // запрещает срабатывание события "submit"

    if (this.inSendProcess) {
      return;
    }

    const askStatus = this.components.inputAsk.validation();

    this.tipHendler({
      isValid: askStatus.isValid,
      message: getValidationMessage({ tipName: 'ask', validationMessage: askStatus.message }),
      tipName: 'tipAsk',
    });

    this.setFocus({
      isValidAsk: askStatus.isValid,
    });

    if (askStatus.isValid) {
      this.formDisable();
      const data = {
        text: this.components.inputAsk.getData(),
      };
      PubSub.publish('form-ask-question-data', data);
    }
  }

  tipHendler({ isValid, message, tipName }) {
    if (isValid) {
      this.components[tipName].showTip({ message: '' });
      return;
    }

    this.components[tipName].showTip({ message });
  }


  setFocus({ isValidAsk }) {
    if (!isValidAsk) {
      this.components.inputAsk.setFocus();
      return;
    }

    document.activeElement.blur();
  }

  formDisable() {
    this.inSendProcess = true;
    this.components.inputAsk.disable();
  }

  formEnable() {
    this.inSendProcess = false;
    this.components.inputAsk.enable();
  }

  formClear() {
    this.components.inputAsk.clear();
  }


  initComponentInputAsk() {
    this.components.inputAsk = new Textarea({
      el: this.elements.askContainer,
      componentName: 'ask',
      maxLength: 500,
      placeholder: 'Задайте свой вопрос спикеру',
    });
  }

  initComponentTipAsk() {
    this.components.tipAsk = new TipInline({
      el: this.elements.tipAskContainer,
      componentName: 'ask',
    });
  }


  initComponentButtonSubmit() {
    this.components.buttonSubmit = new ButtonSubmit({
      el: this.elements.buttonSubmitContainer,
      className: 'button-main',
      componentName: 'button-submit-ask',
      value: 'Задать вопрос',
    });
  }
}
