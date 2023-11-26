const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-2'
})
const util = require('../utils/util');

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getTaskStatus(userInfo) {
    const Date = userInfo.Date;
    const tableName = userInfo.tableName;

    if(!Date || !tableName) {
        return util.buildResponse(401, {
            message: 'All fields are required'
        })
    }

    const dynamoUser = await getUser(tableName, Date);
    if (!dynamoUser) {
        return util.buildResponse(200, {});
    }
    
    const status = dynamoUser.task;

    return util.buildResponse(200, status);
}

async function getUser(tableName, Date) {
    const params = {
        TableName: tableName,
        Key: {
            Date: Date
        }
    }
    return await dynamodb.get(params).promise().then(response => {
    return response.Item;
    }, error => {
        console.error('There is an error getting user', error);
    })
}
module.exports.getTaskStatus=getTaskStatus;