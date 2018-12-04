import PubSub from 'pubsub-js';
import httpRequest from 'utils/http-request.js';
import BaseComponent from 'components/__shared/base-component';
import ButtonRecord from 'components/buttons/button-record';
import getMimeType from './get-mime-type';
import defineGetUserMedia from './define-get-user-media';
import connectStreamSource from './connect-stream-source';
import readBlob from './read-blob';
import './style.scss'; // css
import template from './template.hbs';


export default class Stram extends BaseComponent {
  constructor({ el }) {
    super({ el });
    this.components = {};
    this.eventsPubSub = {};

    this.firstRequestTime = 400;
    this.requestInteval = 5000;
    this.optionsUserMedia = {
      video: { width: 1280, height: 720 },
      audio: true,
    };
    this.optionsRecorder = {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 250000,
    };

    this.blobBuffer = [];
    this.recordedChunks = [];
    this.isRecord = false;
    this.questionId = el.getAttribute('data-questionId');

    this.render();

    this.elements.video = el.querySelector('[data-element="stream__video"]');
    this.elements.ButtonRecordContainer = el.querySelector('[data-element="stream__button-record-container"]');

    this.initComponentButtonRecord();

    this.playVideo = this.playVideo.bind(this);
    this.onHandleDataAvailable = this.onHandleDataAvailable.bind(this);
    this.onStartRecord = this.onStartRecord.bind(this);
    this.onStopRecord = this.onStopRecord.bind(this);

    this.optionsRecorder.mimeType = getMimeType();

    if (!this.optionsRecorder.mimeType) {
      console.warn('mimeType not supported');
      return;
    }

    this.addEvents();
    defineGetUserMedia();
    this.createMediaStream();
  }

  render() {
    this.el.innerHTML = template();
  }

  addEvents() {
    this.eventsPubSub.buttonRecord = PubSub.subscribe('record', this.onClickRecord.bind(this));
  }

  removeEvents() {
    this.elements.video.removeEventListener('loadedmetadata', this.playVideo);
    if (this.mediaRecorder) {
      this.mediaRecorder.removeEventListener('dataavailable', this.onHandleDataAvailable);
      this.mediaRecorder.removeEventListener('start', this.onStartRecord);
    }

    this.unsubscribe();
  }

  initComponentButtonRecord() {
    this.components.buttonRecord = new ButtonRecord({
      el: this.elements.ButtonRecordContainer,
      componentName: 'button-record',
      eventName: 'record',
    });
    this.components.buttonRecord.hide();
  }

  playVideo() {
    this.elements.video.removeEventListener('loadedmetadata', this.playVideo);
    this.elements.video.play();
    this.components.buttonRecord.show();
  }

  createMediaStream() {
    navigator.mediaDevices.getUserMedia(this.optionsUserMedia)
      .then((mediaStream) => {
        this.mediaStream = mediaStream;
        connectStreamSource({
          videoElem: this.elements.video,
          mediaStream,
        });
        this.mediaRecorder = new MediaRecorder(mediaStream, this.optionsRecorder);

        this.elements.video.addEventListener('loadedmetadata', this.playVideo);
        this.mediaRecorder.addEventListener('start', this.onStartRecord);
        this.mediaRecorder.addEventListener('stop', this.onStopRecord);
      })
      .catch((e) => {
        console.warn(e);
      });
  }


  onHandleDataAvailable(event) {
    if (event.data.size === 0) {
      return;
    }

    this.recordedChunks.push(event.data);
    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
    this.blobBuffer.push(blob);
    this.recordedChunks = [];

    readBlob(blob)
      .then((arrayBuffer) => {
        if (this.isStart) {
          this.isStart = false;
          this.sendArrayBuffer({
            url: `<%publicPathBackEnd%>/api/stream/${this.questionId}/start`,
            arrayBuffer,
          });

          return;
        }
        if (this.isRecord) {
          this.sendArrayBuffer({
            url: `<%publicPathBackEnd%>/api/stream/${this.questionId}`,
            arrayBuffer,
          });

          return;
        }

        this.sendArrayBuffer({
          url: `<%publicPathBackEnd%>/api/stream/${this.questionId}/stop`,
          arrayBuffer,
        });
      });
  }

  onClickRecord() {
    if (!this.isRecord) {
      this.mediaRecorder.addEventListener('dataavailable', this.onHandleDataAvailable);
      this.mediaRecorder.start(this.requestInteval);
      return;
    }
    if (this.isRecord) {
      this.clearStartTimer();
      this.mediaRecorder.stop();
    }
  }

  onStartRecord() {
    this.isRecord = true;
    this.isStart = true;
    this.components.buttonRecord.setRecord({ record: true });
    this.startTimer = setTimeout(() => {
      this.mediaRecorder.requestData();
      this.startTimer = null;
    }, this.firstRequestTime);
  }

  onStopRecord() {
    this.isRecord = false;
    this.components.buttonRecord.setRecord({ record: false });
    this.mediaRecorder.addEventListener('dataavailable', this.onHandleDataAvailable);
  }

  sendArrayBuffer({ url, arrayBuffer }) {
    httpRequest.post({
      url,
      options: {
        contentType: 'video/webm',
        data: arrayBuffer,
      },
    })
      .then(() => {})
      .catch((err) => {
        if (this.mediaRecorder.state === 'recording') {
          this.mediaRecorder.removeEventListener('dataavailable', this.onHandleDataAvailable);
          this.mediaRecorder.stop();
        }
        console.warn(err);
      });
  }

  clearStartTimer() {
    if (this.startTimer) {
      clearTimeout(this.startTimer);
    }
  }

  stopStream() {
    this.mediaStream.getAudioTracks()[0].stop();
    this.mediaStream.getVideoTracks()[0].stop();
  }
}
