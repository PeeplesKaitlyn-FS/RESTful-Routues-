// errors.js
class ContactResourceError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'ContactResourceError';
    this.statusCode = statusCode;
  }
}

module.exports = {
  ContactResourceError
};