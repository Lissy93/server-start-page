/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

/**
 * Function called when an error happens
 * If you wish to use an error logging service, put code for it here
 */
const ErrorHandler = function handler(msg, error = 'No stack trace provided') {
  console.warn(msg, error);
};

export default ErrorHandler;
