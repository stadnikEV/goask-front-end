export default class HttpError extends Error {
  constructor({ status, message }) {
    super();
    this.status = status;
    this.name = this.constructor.name;
    this.message = `${status} ${message}`;
    this.stack = (new Error(message)).stack;
  }
}
