//import all the services (login, register, verify)
const loginService = require('./service/login');
const registerService = require('./service/register');
const verifyService = require("./service/verify");
const addressService = require("./service/address");
const shiftTrackingService = require("./service/timeIn");
const timeOutService = require("./service/timeOut");

const util = require('./utils/util');

const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';
const addressPath = '/csvAddress';
const addLocationPath = '/timein';
const timeOutPath = '/timeout';


exports.handler = async (event) => {
  console.log('Request Event: ', event);
  let response;
  switch(true) {
    case event.httpMethod === 'GET' && event.path === healthPath:
      response = util.buildResponse(200);
      break;
    case event.httpMethod === 'POST' && event.path === registerPath:
      const registerBody = JSON.parse(event.body);
      response = await registerService.register(registerBody);
      break;
    case event.httpMethod === 'POST' && event.path === loginPath:
      const loginBody = JSON.parse(event.body);
      response = await loginService.login(loginBody);
      break;
    case event.httpMethod === 'POST' && event.path === verifyPath:
      const verifyBody = JSON.parse(event.body);
      response = await verifyService.verify(verifyBody);
      break;
    case event.httpMethod === 'GET' && event.path === addressPath:
      response = await addressService.address();
      break;
    case event.httpMethod === 'POST' && event.path === addLocationPath:
      const shiftBody = JSON.parse(event.body);
      response = await shiftTrackingService.shift(shiftBody);
      break;
    case event.httpMethod === 'POST' && event.path === timeOutPath:
      const timeOutBody = JSON.parse(event.body);
      response = await timeOutService.timeOut(timeOutBody);
      //response = util.buildResponse(200);
      break;
    default:
      response = await util.buildResponse(404, "404 Not Found");
  }
  return response;
};