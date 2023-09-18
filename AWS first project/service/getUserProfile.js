const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-2'
})
const util = require('../utils/util');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'jinmeister-users';



async function getUserProfile(username) {
    const params = {
        TableName: userTable,
        Key: {
            username: username
        }
    }
    
    try {
        const response = await dynamodb.get(params).promise();
        if (response.Item) {
            const { name, username, email } = response.Item;
            const responseBody = { name, username, email }
            //return { name, username, email };
            return util.buildResponse(200, responseBody);
        } else {
            console.error('User not found');
            return null; // Return null if the user is not found
        }
    } catch (error) {
        console.error('There is an error getting user', error);
        return util.buildResponse(500, { message: 'Internal Server Error ' + error});
    }
}

module.exports.getUserProfile=getUserProfile;