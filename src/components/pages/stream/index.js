import PubSub from 'pubsub-js';
import BaseComponent from 'components/__shared/base-component';
import Header from 'components/header';
import Stream from 'components/stream';
import TipInline from 'components/tip-inline';
import 'components/__shared/css/reset.scss'; // css
import 'components/__shared/css/base.scss'; // css
import './style.scss'; // css


export default class PageStream extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.elements.headerContainer = el.querySelector('[data-element="page__header-container"]');
    this.elements.tipInlineContainer = el.querySelector('[data-element="page__tip-inline-container"]');
    this.elements.streamContainer = el.querySelector('[data-element="page__stream-container"]');

    this.initHeader();
    this.inittTipInline();
    this.initStream();

    this.addEvents();
  }

  addEvents() {
    this.eventsPubSub.buttonRecord = PubSub.subscribe('tip-inline-stream-error', this.onTipInlineErrorHendler.bind(this));
    this.eventsPubSub.buttonRecord = PubSub.subscribe('tip-inline-stream', this.onTipInlineHendler.bind(this));
  }


  removeEvents() {
    this.unsubscribe();
  }

  initHeader() {
    this.components.header = new Header({
      el: this.elements.headerContainer,
    });
  }

  inittTipInline() {
    this.components.tipInline = new TipInline({
      el: this.elements.tipInlineContainer,
      componentName: 'tip-inline-stream',
    });
  }

  initStream() {
    this.components.stream = new Stream({
      el: this.elements.streamContainer,
    });
  }

  onTipInlineHendler(msg, data) {
    this.clearTimerTipInline();
    this.components.tipInline.showTip({
      message: data.message,
      color: 'green',
    });
  }

  onTipInlineErrorHendler(msg, err) {
    this.clearTimerTipInline();
    this.components.tipInline.showTip({
      message: err.message,
    });

    this.timerTipInline = setTimeout(() => {
      this.components.tipInline.showTip({
        message: '',
      });
    }, 3000);
  }

  clearTimerTipInline() {
    if (this.timerTipInline) {
      clearTimeout(this.timerTipInline);
    }
  }
}
