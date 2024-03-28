const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-2'
})
const util = require('../utils/util');

const bcrypt = require('bcryptjs');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Missed_Punch_Clock'
const uuid = require('uuid');

async function missedPunchClock(userInfo) {
    const { name, email, timeAndDate, clock } = userInfo;

    if (!name, !email, !timeAndDate, !clock) {
        return util.buildResponse(401, {
            message: "All fields are required"
        })
    }

    try {
        const uniqueId = uuid.v4();

        const requestBody = {
            id: uniqueId,
            namme: name,
            email: email,
            timeAndDate: timeAndDate,
            clock: clock
        }

        await saveUser(requestBody)
        return util.buildResponse(200, {
            message: 'OK'
        });
        
    }  catch (error) {
        console.error('Error:', error);
        return util.buildResponse(500, {
            message: 'Internal server error' + error.message
        });
    }
    
}

async function saveUser(user) {
    const params = {
        TableName: tableName,
        Item: user
    };

    try {
        await dynamodb.put(params).promise();
    } catch (error) {
        console.error('Error saving user:', error);
        throw error;
    }
}

module.exports.missedPunchClock = missedPunchClock;
