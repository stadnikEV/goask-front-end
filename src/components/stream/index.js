import PubSub from 'pubsub-js';
import httpRequest from 'utils/http-request.js';
import readBlob from 'utils//read-blob';
import CustomError from 'utils/custom-error.js';
import BaseComponent from 'components/__shared/base-component';
import ButtonRecord from 'components/buttons/button-record';
import getMimeType from './get-mime-type';
import defineGetUserMedia from './define-get-user-media';
import connectStreamSource from './connect-stream-source';
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
      video: {
        width: 1280,
        height: 720,
        frameRate: 25,
      },
      audio: true,
    };
    this.optionsRecorder = {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 5242880,
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
    this.stopRecord = this.stopRecord.bind(this);
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
      this.mediaRecorder.removeEventListener('stop', this.onStopRecord);
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
          this.sendStreamStart(arrayBuffer);
          return;
        }

        if (this.isRecord) {
          if (this.streamIsBusy && this.mediaRecorder.state === 'recording') {
            const err = new CustomError({ message: 'reques data timeout' });
            console.warn(err);
            PubSub.publish('tip-inline-stream-error', err);
            this.streamIsBusy = false;
            this.mediaRecorder.removeEventListener('dataavailable', this.onHandleDataAvailable);
            this.stopRecord();
            return;
          }

          this.sendStream(arrayBuffer);
          return;
        }

        this.sendStreamStop(arrayBuffer);
      });
  }


  onClickRecord() {
    if (!this.isRecord && this.mediaRecorder.state === 'inactive') {
      this.startRecord();
      PubSub.publish('tip-inline-stream', {
        message: '',
      });
      return;
    }
    if (this.mediaRecorder.state === 'recording') {
      this.stopRecord();
      PubSub.publish('tip-inline-stream', {
        message: 'video is encoded now',
      });
    }
  }


  startRecord() {
    this.mediaRecorder.addEventListener('dataavailable', this.onHandleDataAvailable);
    this.mediaRecorder.start(this.requestInteval);
  }


  stopRecord() {
    if (this.streamIsBusy) {
      this.mediaRecorder.pause();
      this.components.buttonRecord.setRecord({ record: false });
      this.eventsPubSub.streamReady = PubSub.subscribe('stream-ready', this.stopRecord);
      return;
    }

    this.mediaRecorder.stop();
  }

  onStartRecord() {
    this.isStart = true;
    this.isRecord = true;
    this.streamIsBusy = false;
    this.components.buttonRecord.setRecord({ record: true });
    this.setStartTimeout();
  }


  onStopRecord() {
    this.isStart = false;
    this.isRecord = false;
    this.components.buttonRecord.setRecord({ record: false });
    this.clearStartTimer();
    this.mediaRecorder.removeEventListener('dataavailable', this.onHandleDataAvailable);
    if (this.eventsPubSub.streamReady) {
      PubSub.unsubscribe(this.eventsPubSub.streamReady);
      delete this.eventsPubSub.streamReady;
    }
  }

  sendStreamStart(arrayBuffer) {
    this.isStart = false;
    this.streamIsBusy = true;
    this.sendArrayBuffer({
      url: `<%publicPathBackEnd%>/api/stream/${this.questionId}/start`,
      arrayBuffer,
    });
  }

  sendStream(arrayBuffer) {
    this.streamIsBusy = true;
    this.sendArrayBuffer({
      url: `<%publicPathBackEnd%>/api/stream/${this.questionId}`,
      arrayBuffer,
    });
  }

  sendStreamStop(arrayBuffer) {
    this.streamIsBusy = true;
    this.sendArrayBuffer({
      url: `<%publicPathBackEnd%>/api/stream/${this.questionId}/stop`,
      arrayBuffer,
    });
  }

  sendArrayBuffer({ url, arrayBuffer }) {
    httpRequest.post({
      url,
      options: {
        contentType: 'video/webm',
        data: arrayBuffer,
      },
    })
      .then(() => {
        this.streamIsBusy = false;
        PubSub.publish('stream-ready');
      })
      .catch((err) => {
        PubSub.publish('tip-inline-stream-error', err);
        if (this.mediaRecorder.state === 'recording') {
          this.streamIsBusy = false;
          this.mediaRecorder.removeEventListener('dataavailable', this.onHandleDataAvailable);
          this.stopRecord();
        }
        console.warn(err);
      });
  }


  setStartTimeout() {
    this.startTimer = setTimeout(() => {
      this.mediaRecorder.requestData();
      this.startTimer = null;
    }, this.firstRequestTime);
  }


  clearStartTimer() {
    if (this.startTimer) {
      clearTimeout(this.startTimer);
    }
  }


  stopWebcam() {
    this.mediaStream.getAudioTracks()[0].stop();
    this.mediaStream.getVideoTracks()[0].stop();
  }
}
