const http2 = require('node:http2');

const ok = http2.constants.HTTP_STATUS_OK; // 200
const created = http2.constants.HTTP_STATUS_CREATED; // 201

const badRequest = http2.constants.HTTP_STATUS_BAD_REQUEST; // 400
const notFound = http2.constants.HTTP_STATUS_NOT_FOUND; // 404

const serverError = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR; // 500

module.exports = {
  ok,
  notFound,
  serverError,
  created,
  badRequest,
};
