export default () => {
  if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
    return 'video/webm; codecs=vp9';
  }
  if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
    return 'video/webm; codecs=vp8';
  }
  return false;
};
