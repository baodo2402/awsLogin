const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-2'
});
const util = require('../utils/util');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'user-info-table';

async function shiftTracking(event) {
    try {
        const { email, clockInTime, clockOutTime } = JSON.parse(event.body);

        // Step 1: Retrieve the username from the 'jinmeister-users' table
        const getUserParams = {
            TableName: tableName,
            Key: {
                email: email
            },
        };

        const userResponse = await dynamodb.get(getUserParams).promise();

        if (userResponse.Item && userResponse.Item.email) {
            // Step 2: Store retrievedUsername, timeIn, timeOut to 'shift-tracking' table
            const params = {
                TableName: 'shift-tracking',
                Item: {
                    email: userResponse.Item.email,
                    clockIn: clockInTime,
                    clockOut: clockOutTime,
                },
            };

            await dynamodb.put(params).promise();
            return util.buildResponse(200, { message: 'Data stored successfully' });
        } else {
            return util.buildResponse(404, { message: 'User not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        return util.buildResponse(500, { message: 'Internal server error' });
    }
}

module.exports.shiftTracking = shiftTracking;
