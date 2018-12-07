export default class CustomError extends Error {
  constructor({ message }) {
    super();
    this.name = this.constructor.name;
    this.message = `${message}`;
    this.stack = (new Error(message)).stack;
  }
}
