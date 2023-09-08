//import all the services (login, register, verify)
const loginService = require('./service/login');
const registerService = require('./service/register');
const verifyService = require("./service/verify");
const util = require('./utils/util');

const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';


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
    default:
      response = await util.buildResponse(404, "404 Not Found");
  }

  // response = {
  //   statusCode: 200,
  //     headers:{
  //       "Access-Control-Allow-Headers" : "Content-Type",
  //       "Access-Control-Allow-Origin": "*",
  //       "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
  //     }
  // };
  return response;
};