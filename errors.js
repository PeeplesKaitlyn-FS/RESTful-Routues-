class ContactResourceError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'ContactResourceError';
    this.statusCode = statusCode;
  }
}


class ContactNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ContactNotFoundError';
  }
}

class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}

class PagerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PagerError';
  }
}

class PagerNoResultsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PagerNoResultsError';
  }
}

class PagerOutOfRangeError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PagerOutOfRangeError';
  }
}

class NoContactsFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NoContactsFoundError';
    }
}

class InvalidContactSchemaError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidContactSchemaError';
    }
}

module.exports = {
  ContactResourceError,
  ContactNotFoundError,
  ApiError,
  PagerError,
  PagerNoResultsError,
  PagerOutOfRangeError,
  NoContactsFoundError,
  InvalidContactSchemaError
};