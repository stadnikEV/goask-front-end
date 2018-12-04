export default ({ videoElem, mediaStream }) => {
  if ('srcObject' in videoElem) {
    videoElem.srcObject = mediaStream;
    return;
  }
  videoElem.src = window.URL.createObjectURL(mediaStream);
};
