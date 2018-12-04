const videoWeb = document.querySelector(".video-webcam");
const button = document.querySelector("button");

let mediaRecorder = null;
let recordedChunks = [];
let sourceBuffer = null;
const blobBuf = [];
let state = 'stendby';

navigator.getUserMedia = navigator.getUserMedia;

function sendArrayBuffer({url, arrayBuffer}) {
  var request = fetch(url,
    {
      method: 'POST',
      body: arrayBuffer
    })
    .then((response) => {
      return response.json()
    })
    .then((json) => {
      // console.log(json.status);
      if (json.status === 403) {
        return Promise.reject();
      }
    })
    .catch((e) => {
      // if (mediaRecorder.state === 'recording') {
      //   mediaRecorder.stop();
      //   setTimeout(() => {
      //     mediaRecorder.start(1000);
      //   }, 1000);
      // }
    });
}

const readBlob = (blob) => {
  return new Promise((resolve) => {
    var fileReader = new FileReader();
    fileReader.onload = function(event) {
      arrayBuffer = event.target.result;
      resolve(arrayBuffer);
    };
    fileReader.readAsArrayBuffer(blob);
  });
}


const onClick = () => {
  if (state === 'stendby') {
    button.classList.add('button_record');
    mediaRecorder.start(5000);
    state = 'record';
    return;
  }
  if (state === 'record') {
    button.classList.remove('button_record');
    mediaRecorder.stop();
    state = 'stendby';
  }
}

const onloadedmetadata = () => {
  videoWeb.play();
  button.addEventListener('click', onClick);
}

const handleDataAvailable = (event) => {
  if (event.data.size === 0) {
    return;
  }
  recordedChunks.push(event.data);
  let blob = new Blob(recordedChunks, { type: 'video/webm' });
  blobBuf.push(blob);
  recordedChunks = [];
  readBlob(blob)
    .then((arrayBuffer) => {
      if (mediaRecorder.state === 'recording') {
        sendArrayBuffer({
          url: 'http://localhost:5000/stream/50',
          arrayBuffer
        });
      }
      if (mediaRecorder.state === 'inactive') {
        sendArrayBuffer({
          url: 'http://localhost:5000/stream-stop/50',
          arrayBuffer
        });
      }
    });
};


navigator.mediaDevices.getUserMedia({video: true, audio: true})
  .then((stream) => {
    videoWeb.srcObject = stream;
    videoWeb.addEventListener('loadedmetadata', onloadedmetadata);
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm; codecs=vp9',
      audioBitsPerSecond : 128000,
      videoBitsPerSecond : 250000,
    });

    mediaRecorder.addEventListener('dataavailable', handleDataAvailable);
  })
  .catch((e) => {
    console.log(e);
  });
