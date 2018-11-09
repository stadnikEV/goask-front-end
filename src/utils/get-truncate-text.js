export default ({ el, height, width }) => {
  const tempElem = el.cloneNode(true);
  tempElem.style.visibility = 'hidden';
  tempElem.style.width = `${width}px`;
  tempElem.style.fontSize = getComputedStyle(el).fontSize;
  tempElem.style.fontWeight = getComputedStyle(el).fontWeight;
  tempElem.style.fontStyle = getComputedStyle(el).fontStyle;

  document.body.appendChild(tempElem);

  let str = tempElem.textContent;


  while (tempElem.clientHeight > height) {
    const lastIndex = str.lastIndexOf(' ');
    if (lastIndex === -1) {
      break;
    }
    str = str.substring(0, lastIndex);
    if (str.search(/^\s*$/) === -1) {
      str += '...';
    }

    tempElem.innerHTML = str;
  }

  document.body.removeChild(tempElem);

  return str;
};
