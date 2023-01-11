const { success, error } = require("../handlers/response.handler");
const { sendEmail } = require("../handlers/email.handler");
const message = require("../constants/message.constants");
const vars = require("./vars");

const globalVariablesFunction = () => {
  global.successHandler = success;
  global.errorHandler = error;
  global.sendEmail = sendEmail;
  global.message = message;
  global.vars = vars;
};

module.exports = globalVariablesFunction;
