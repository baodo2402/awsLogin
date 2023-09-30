const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-2'
})
const util = require('../utils/util');

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function updateCalendar(userInfo) {
    try {
    const tableName = userInfo.tableName;
    const Date = userInfo.Date;
    const username = userInfo.username;
    const task = userInfo.task;
    const status = userInfo.status;
    const recurrence_pattern = userInfo.recurrence_pattern;

        //check if any field is not filled yet
    if(!Date || !username || !task || status == 'undefined' || status == null || !tableName || 
        !recurrence_pattern) {
        return util.buildResponse(401, {
            message: 'All fields are required'
        })
    }

    const user = {
        Date: Date,
        username: username.toLowerCase().trim(),
        task: task,
        status: status,
        recurrence_pattern: recurrence_pattern
    }

    //save object to the database
    const saveUserResponse = await saveCalendar(tableName, user);
    if (!saveUserResponse) {
        return util.buildResponse(503, {message: 'Sever error. Please try again later'});
    }
    return util.buildResponse(200, {username: username});

    } catch (error) {
        console.error('Error in updateCalendar:', error);
        return util.buildResponse(500, { message: 'Internal server error' });
    }

}

async function saveCalendar(tableName, user) {
    const params = {
        TableName: tableName,
        Item: user
    }
    try {
        await dynamodb.put(params).promise();
        return true;
    } catch (error) {
        console.error('Error saving data: ', error);
        throw error;
    }
}

module.exports.updateCalendar=updateCalendar;