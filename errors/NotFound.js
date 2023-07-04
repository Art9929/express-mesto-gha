class NotFound extends Error {
  constructor(message) {
    super(message || 'asdsad');
    this.statusCode = 404;
  }
}

module.exports = NotFound;
