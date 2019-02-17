export default ({ el }) => {
  const tempElem = el.cloneNode(true);
  tempElem.style.visibility = 'hidden';
  tempElem.style.width = `${el.offsetWidth}px`;
  tempElem.style.height = `${el.offsetHeight}px`;
  tempElem.style.fontSize = getComputedStyle(el).fontSize;
  tempElem.style.fontWeight = getComputedStyle(el).fontWeight;
  tempElem.style.fontStyle = getComputedStyle(el).fontStyle;

  document.body.appendChild(tempElem);

  let str = tempElem.value;

  console.log(tempElem);
  while (tempElem.scrollHeight > tempElem.offsetHeight) {
    const lastSpace = str.lastIndexOf(' ');
    const lastWrap = str.lastIndexOf('\n');

    const lastIndex = (lastSpace > lastWrap)
      ? lastSpace
      : lastWrap;

    if (lastIndex === -1) {
      break;
    }
    str = str.substring(0, lastIndex);
    str += '...';
    tempElem.value = str;
  }


  while (str.slice(-4) === '\n...'
        || str.slice(-4) === ' ...'
        || str.slice(-4) === ',...'
        || str.slice(-4) === '....') {
    str = str.slice(0, -4);
    str += '...';
  }

  document.body.removeChild(tempElem);

  return str;
};
