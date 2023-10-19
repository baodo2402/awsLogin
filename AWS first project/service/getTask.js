const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-2'
})
const util = require('../utils/util');
const auth = require('../utils/auth');

const dynamodb = new AWS.DynamoDB.DocumentClient();


async function getTask(userInfo) {
    const tableNameSub = userInfo.tableNameSub;
    const recurrence_pattern = userInfo.recurrence_pattern;

    if (!tableNameSub || !recurrence_pattern) {
        return util.buildResponse(401, {
            message: 'tableNameSub and recurrence_pattern are required'
        })
    }

    const dynamoUser = await getItems(tableNameSub, recurrence_pattern);
    if (dynamoUser) {
        return util.buildResponse(200, dynamoUser);
    }
    
}

async function getItems(table, recurrence_pattern) {
    const params = {
        TableName: table,
        Key: {
            recurrence_pattern: recurrence_pattern
        },
        ProjectionExpression: 'recurrence_pattern, task, dayOfWeek'
    }
    return await dynamodb.get(params).promise().then(response => {
        return response.Item;
    }, error => {
        console.error('There is an error getting items', error);
    })
}
module.exports.getTask = getTask;