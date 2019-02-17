export default (blob) => {
  const promise = new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const arrayBuffer = event.target.result;
      resolve(arrayBuffer);
    };
    fileReader.readAsArrayBuffer(blob);
  });

  return promise;
};
