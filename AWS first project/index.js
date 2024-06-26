//import all the services (login, register, verify)
const loginService = require('./service/login');
const registerService = require('./service/register');
const verifyService = require("./service/verify");
const addressService = require("./service/address");
const shiftTrackingService = require("./service/timeIn");
const timeOutService = require("./service/timeOut");
const triggerChangeInfoService = require("./service/triggerChangeInfo");
const changeInfoService = require("./service/changeInfo");
const getUserProfileService = require("./service/getUserProfile");
const updateCalendarService = require("./service/updateCalendar");
const getTaskService = require("./service/getTask");
const getTasksService = require("./service/getTasks");
const getTaskStatusService = require("./service/getTaskStatus");
const sendPasswordEmailService = require("./service/sendPasswordEmail");
const setYearArrayService = require("./service/setYearArray")
const compareCodeService = require("./service/compareCode");
const resetPasswordService = require("./service/resetPassword");
const compareCoordinatesService = require("./service/compareCoordinates");
const createTableService = require("./service/createTable");
const displayTableResultService = require("./service/displayTableResults");
const listTablesService = require("./service/listTables");
const missedPunchClockService = require("./service/missedPunchClock")

const util = require('./utils/util');

const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';
const addressPath = '/csvAddress';
const addLocationPath = '/timein';
const timeOutPath = '/timeout';
const triggerChangeInfoPath = '/triggerchangeinfo';
const changeInfoPath = '/changeinfo';
const calendarPath = '/calendar';
const getTaskPath = '/gettask';
const getTasksPath = '/gettasks';
const getTaskStatusPath = '/gettaskstatus';
const sendPasswordEmailPath = '/sendemail';
const setYearArrayPath = '/setyear'
const compareCodePath = '/comparecode';
const resetPasswordPath = '/resetpassword';
const compareCoordinatesPath = '/comparecoordinates';
const createTablePath = '/createtable';
const displayTableResultPath = '/displaytableresults';
const listTablesPath = '/listtable';
const missedPunchClockPath = '/missedpunchclock'

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
    case event.httpMethod === 'POST' && event.path === triggerChangeInfoPath:
      const triggerChangeInfoBody = JSON.parse(event.body);
      response = await triggerChangeInfoService.triggerChangeInfo(triggerChangeInfoBody);
      break;
    case event.httpMethod === 'POST' && event.path === changeInfoPath:
      const changeInfoBody = JSON.parse(event.body);
      response = await changeInfoService.changeInfo(changeInfoBody);
      break;
    case event.httpMethod === 'GET' && event.path === triggerChangeInfoPath:
      const getUserProfileBody = JSON.parse(event.body);
      response = await getUserProfileService.getUserProfile(getUserProfileBody);
      break;
    case event.httpMethod === 'POST' && event.path === calendarPath:
      const updateCalendarBody = JSON.parse(event.body);
      response = await updateCalendarService.updateCalendar(updateCalendarBody);
      break;
    case event.httpMethod === 'POST' && event.path === getTaskPath:
      const getTaskBody = JSON.parse(event.body);
      response = await getTaskService.getTask(getTaskBody);
      break;
    case event.httpMethod === 'POST' && event.path === getTasksPath:
      const getTasksBody = JSON.parse(event.body);
      response = await getTasksService.getTasks(getTasksBody);
      break;
    case event.httpMethod === 'POST' && event.path === getTaskStatusPath:
      const getTaskStatusBody = JSON.parse(event.body);
      response = await getTaskStatusService.getTaskStatus(getTaskStatusBody);
      break;
    case event.httpMethod === 'POST' && event.path === sendPasswordEmailPath:
      const sendPasswordEmailBody = JSON.parse(event.body);
      response = await sendPasswordEmailService.sendPasswordEmail(sendPasswordEmailBody);
      break;
    case event.httpMethod === 'POST' && event.path === setYearArrayPath:
      const setYearArrayBody = JSON.parse(event.body);
      response = await setYearArrayService.setYearArray(setYearArrayBody);
      break;
    case event.httpMethod === 'POST' && event.path === compareCodePath:
      const compareCodeBody = JSON.parse(event.body);
      response = await compareCodeService.compareCode(compareCodeBody);
      break;
    case event.httpMethod === 'POST' && event.path === resetPasswordPath:
      const resetPasswordBody = JSON.parse(event.body);
      response = await resetPasswordService.resetPassword(resetPasswordBody);
      break;
    case event.httpMethod === 'POST' && event.path === compareCoordinatesPath:
      const compareCoordinatesBody = JSON.parse(event.body);
      response = await compareCoordinatesService.compareCoordinates(compareCoordinatesBody);
      break;
    case event.httpMethod === 'POST' && event.path === createTablePath:
      const createTableBody = JSON.parse(event.body);
      response = await createTableService.createTable(createTableBody);
      break;
    case event.httpMethod === 'POST' && event.path === displayTableResultPath:
      const displayTableResultBody = JSON.parse(event.body);
      response = await displayTableResultService.displayTableResult(displayTableResultBody);
      break;
    case event.httpMethod === 'GET' && event.path === listTablesPath:
      response = await listTablesService.listTables();
      break;
    case event.httpMethod === 'POST' && event.path === missedPunchClockPath:
      const missedPunchClockBody = JSON.parse(event.body);
      response = await missedPunchClockService.missedPunchClock(missedPunchClockBody);
      break;
    default:
      response = await util.buildResponse(404, "404 Not Found");
  }
  return response;
};