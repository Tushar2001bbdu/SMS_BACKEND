const httpStatusCodes = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    REQ_TIMEOUT: 408,
    CONFLICT: 409,
    UNPROCESSABLE: 422,
    FAILED_DEPENDENCY: 424,
    INTERNAL_SERVER: 500,
  };
  
  const customStatusMessage = {
    INTERNAL_SERVER: 'Internal Server Error',
    BAD_REQUEST: 'Bad Request',
    DB_OPERATION_ERR: 'DB Operation Error',
    APP_ERR: 'Application Error',
    VALIDATION_ERR: 'Validation Error',
    NOT_FOUND: 'Not Found',
  };
  
  module.exports = {
    httpStatusCodes,
    customStatusMessage,
  };