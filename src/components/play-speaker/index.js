import BaseComponent from 'components/__shared/base-component';
import httpRequest from 'utils/http-request.js';
import './style.scss'; // css
import template from './template.hbs';


export default class PlaySpeaker extends BaseComponent {
  constructor({ el }) {
    super({ el });

    this.questionId = el.getAttribute('data-questionId');
    this.getYoutubeId({ questionId: this.questionId })
      .then((response) => {
        this.render({ id: response.youtubeId });
      })
      .catch((e) => {
        console.warn(e);
      });
  }

  render({ id }) {
    this.el.innerHTML = template({ id });
  }

  getYoutubeId({ questionId }) {
    return httpRequest.get({
      url: `<%publicPathBackEnd%>/api/get-youtube-id-speaker/${questionId}`,
    });
  }
}
