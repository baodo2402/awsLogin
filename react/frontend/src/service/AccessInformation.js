const AccessInformation = {
    requestConfig: {
            headers: {
                'x-api-key': 'RRGUElJdDj8gIm9PJ7Agm85ufrwJaBwk5M9K30o4'
            }
        },

        //Register
    registerUrl: 'https://xffytglbqf.execute-api.ap-southeast-2.amazonaws.com/prod/register',

        //Login
    loginUrl: 'https://xffytglbqf.execute-api.ap-southeast-2.amazonaws.com/prod/login',

        //Calendar
    getTasksUrl: 'https://xffytglbqf.execute-api.ap-southeast-2.amazonaws.com/prod/gettasks',
    getTaskStatusUrl: 'https://xffytglbqf.execute-api.ap-southeast-2.amazonaws.com/prod/gettaskstatus',
    calendarUrl: 'https://xffytglbqf.execute-api.ap-southeast-2.amazonaws.com/prod/calendar', //CalendarSearch

        //LocationFinder
    addressUrl: 'https://xffytglbqf.execute-api.ap-southeast-2.amazonaws.com/prod/csvAddress',
    compareCoordinatesUrl: 'https://xffytglbqf.execute-api.ap-southeast-2.amazonaws.com/prod/comparecoordinates',
    timeInUrl: 'https://xffytglbqf.execute-api.ap-southeast-2.amazonaws.com/prod/timein',
    timeOutUrl: 'https://xffytglbqf.execute-api.ap-southeast-2.amazonaws.com/prod/timeout',

        //App
    verifyTokenAPIURL: 'https://xffytglbqf.execute-api.ap-southeast-2.amazonaws.com/prod/verify',

        //Profile, ChangeInfo
    triggerChangeInfoUrl: 'https://xffytglbqf.execute-api.ap-southeast-2.amazonaws.com/prod/changeinfo',

        //ForgetPassword
    sendemailUrl: 'https://xffytglbqf.execute-api.ap-southeast-2.amazonaws.com/prod/sendemail',
    compareCodeUrl: 'https://xffytglbqf.execute-api.ap-southeast-2.amazonaws.com/prod/comparecode',

        //ResetPassword
    resetPasswordUrl: 'https://xffytglbqf.execute-api.ap-southeast-2.amazonaws.com/prod/resetpassword',

        //StaffManagement
    displayTableResultsUrl: 'https://xffytglbqf.execute-api.ap-southeast-2.amazonaws.com/prod/displaytableresults',
    listTablesUrl: 'https://xffytglbqf.execute-api.ap-southeast-2.amazonaws.com/prod/listtable',

        //EditableTable
    addNewCsvFile: 'https://xffytglbqf.execute-api.ap-southeast-2.amazonaws.com/prod/addnewcsvfile',
    listSearchResultsUrl: 'https://xffytglbqf.execute-api.ap-southeast-2.amazonaws.com/prod/listsearchresults',
    deleteobjectUrl: 'https://xffytglbqf.execute-api.ap-southeast-2.amazonaws.com/prod/deleteobject'
}

export default AccessInformation;

