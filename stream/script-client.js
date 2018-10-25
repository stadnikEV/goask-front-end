const vidElement = document.querySelector(".video-webcam");
const button = document.querySelector("button");
const link = document.querySelector("a");

let mediaSource = null;
let theEnd = false;
let sourceBuffer = null;

const createMediaSource = () => {
  mediaSource = new MediaSource();
  vidElement.src = URL.createObjectURL(mediaSource);
  mediaSource.addEventListener('sourceopen', sourceOpen);
};


if (window.MediaSource) {
  createMediaSource();
} else {
  console.log("The Media Source Extensions API is not supported.")
}

function sourceOpen(e) {
  URL.revokeObjectURL(vidElement.src);
  var mime = 'video/webm; codecs="opus, vp09.00.10.08"';
  mediaSource = e.target;
  sourceBuffer = mediaSource.addSourceBuffer(mime);
  sourceBuffer.mode = 'sequence';

  button.addEventListener('click', getStream.bind(null, { getHead: true }));
  button.addEventListener('click', play);
};

const play = () => {
  button.classList.add('hidden');
};

function getLoad() {
  fetch('http://localhost:8080/load/1')
    .then(function(response) {
      if (response.status !== 200) {
        return Promise.reject(response.status);
      }
      return;
    })
    .then(function(arrayBuffer) {
      link.classList.remove('hidden');
    })
    .catch((e) => {
      link.classList.add('hidden');
    });
};

function getStream({ getHead }) {
  fetch('http://localhost:8080/getStream/37', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ head: getHead }),
  })
    .then(function(response) {
      if (response.status !== 200) {
        return response.json();

      }
      return response.arrayBuffer();
    })
    .then(function(data) {
      if (data.name === 'HttpError') {
        return Promise.reject(data);
      }
      const arrayBuffer = data;
      getStream({ getHead: false });
      sourceBuffer.appendBuffer(arrayBuffer);
      vidElement.play();
    })
    .catch((e) => {
      console.log(e);
      button.classList.remove('hidden');
    });
};
