import HttpError from 'utils/http-error.js';

export default ({
  url,
  contentType,
  method,
  data,
}) => {
  const promise = new Promise((resolve, reject) => {
    const params = {
      method,
      credentials: 'include',
    };

    if (contentType) {
      params.headers = {
        'Content-Type': contentType,
      };
      if (contentType === 'application/json') {
        params.body = JSON.stringify(data);
      }
      if (contentType === 'video/webm') {
        params.body = data;
      }
    }

    let response = null;
    let dataType = null;

    fetch(url, params)
      .then((res) => {
        response = res;
        dataType = response.headers.get('content-type');
        if (dataType === 'application/json; charset=utf-8') {
          const json = response.json();
          return json;
        }
        return response.arrayBuffer();
      })
      .then((responeData) => {
        if (response.status !== 200) {
          if (dataType === 'application/json; charset=utf-8') {
            return Promise.reject(new HttpError({
              status: responeData.status,
              message: responeData.message,
            }));
          }
        }
        return resolve(responeData);
      })
      .catch((err) => {
        reject(err);
      });
  });

  return promise;
};
