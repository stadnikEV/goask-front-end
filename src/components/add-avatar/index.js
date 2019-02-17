import base64 from 'base64-arraybuffer';
import BaseComponent from 'components/__shared/base-component';
import readBlob from 'utils//read-blob';
import template from './template.hbs';
import './style.scss';
import logоImage from './img/avatar.png';


export default class AddAvatar extends BaseComponent {
  constructor({ el }) {
    super({ el });

    this.render();
    this.elements.addAvatar = document.querySelector('[data-component="add-avatar"]');
    this.elements.img = document.querySelector('[data-element="add-avatar__img"]');
    this.elements.input = document.querySelector('[data-element="add-avatar__input"]');

    this.elements.img.style.width = `${this.elements.addAvatar.clientHeight}px`;
    this.elements.img.src = '<%publicPathFrontEnd%>/img/avatar.png';
    this.onChange = this.onChange.bind(this);

    this.addEvents();
  }

  render() {
    this.el.innerHTML = template();
  }

  addEvents() {
    this.elements.input.addEventListener('change', this.onChange);
  }

  removeEvents() {
    this.elements.input.removeEventListener('change', this.onChange);
  }

  onChange() {
    const file = this.elements.input.files[0];
    this.file = file;
    const urlCreator = window.URL || window.webkitURL;
    this.imageUrl = urlCreator.createObjectURL(file);
    this.elements.img.src = this.imageUrl;

    this.getImgDimensions()
      .then((imgDimensions) => {
        this.width = imgDimensions.width;
        this.height = imgDimensions.height;
      });
  }

  validation() {
    if (!this.file) {
      return {
        message: 'is empty',
        isValid: false,
      };
    }
    if (this.width > 600 || this.height > 600) {
      return {
        message: 'file limit exceeded',
        isValid: false,
      };
    }
    return { isValid: true };
  }

  getImgDimensions() {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        });
      };
      img.src = this.imageUrl;
    });
  }

  setFocus() {
    this.elements.input.focus();
  }

  getData() {
    return new Promise((resolve, reject) => {
      readBlob(this.file)
        .then((arrBuffer) => {
          const data = base64.encode(arrBuffer);
          resolve({
            data,
            extend: this.file.name.match(/.[a-zA-z]+$/)[0],
          });
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
}
