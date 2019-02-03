import router from 'router';
import PubSub from 'pubsub-js';
import httpRequest from 'utils/http-request.js';
import BaseComponent from 'components/__shared/base-component';
import AdminSpeakerList from 'components/admin/admin-speaker-list';
import 'components/__shared/css/reset.scss';
import 'components/__shared/css/base.scss';
import './style.scss';
import template from './template.hbs';


export default class AdminSpeakersConfirm extends BaseComponent {
  constructor({ el, filter, fields }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.getSpeakers({ filter, fields })
      .then((speakers) => {
        this.render();
        this.elements.speakersConfirm = document.querySelector('[data-component="speakers-confirm"]');
        this.elements.speakersListContainer = this.elements.speakersConfirm.querySelector('[data-element="speakers-confirm__speakers-list-container"]');
        this.initSpeakerList({ speakers });
        this.addEvents();
      })
      .catch((err) => {
        if (err.status === 403) {
          router.setRouteHash({ routeHash: 'login' });
          return;
        }
        console.warn(err);
      });
  }

  render() {
    this.el.innerHTML = template();
  }

  addEvents() {
    this.eventsPubSub.buttonDetails = PubSub.subscribe('button-details', this.onButtonDetails.bind(this));
    this.eventsPubSub.buttonConfirm = PubSub.subscribe('button-confirm', this.onButtonConfirm.bind(this));
  }

  removeEvents() {
    this.unsubscribe();
  }

  initSpeakerList({ speakers }) {
    this.components.speakerList = new AdminSpeakerList({
      el: this.elements.speakersListContainer,
      speakers,
    });
  }

  getSpeakers({ filter, fields }) {
    return httpRequest.get({
      url: `<%publicPathBackEnd%>/api/speakers?filter=${filter}&fields=${fields}`,
    });
  }

  onButtonDetails(msg, { speakerId }) {
    router.setRouteHash({ routeHash: `about-speaker/${speakerId}` });
  }

  onButtonConfirm(msg, { active, speakerId, listItemComponent }) {
    httpRequest.post({
      url: `<%publicPathBackEnd%>/api/speakers/${speakerId}/status`,
      options: {
        data: {
          active,
        },
      },
    })
      .then(({ lastStatus, status }) => {
        if (lastStatus === undefined) {
          listItemComponent.destroy();
          return;
        }
        PubSub.publish(`change-speaker-status-${speakerId}`, { status });
      })
      .catch((err) => {
        console.warn(err);
      });
  }
}
