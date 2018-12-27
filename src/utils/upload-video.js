import HttpError from 'utils/http-error.js';

export default ({ formData, url, progress = () => {} }) => {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    function onResponseHandler() {
      const dataType = this.getResponseHeader('Content-Type');

      if (this.status !== 200 && this.status !== 201) {
        if (dataType === 'application/json; charset=utf-8') {
          const json = JSON.parse(this.responseText);
          reject(new HttpError({
            status: json.status,
            message: json.message,
          }));

          return;
        }

        reject(new HttpError({
          status: this.status,
          message: '',
        }));

        return;
      }

      resolve();
    }

    xhr.onload = onResponseHandler;
    xhr.onerror = onResponseHandler;
    xhr.upload.onprogress = (event) => {
      progress(event);
    };

    xhr.open('POST', url, true);
    xhr.send(formData);
  });

  return promise;
};
