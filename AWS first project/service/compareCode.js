const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-2'
})
const util = require('../utils/util');
const tableName = 'code-requests'
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function compareCode(userInfo) {
    const email = userInfo.email;
    const code = userInfo.code;

    const getDynamoCode = await getCode(email);
    if (!getDynamoCode && !getDynamoCode.email) {
        return util.buildResponse(401, {
            message: 'email was not saved'
        })
    } else {
        if (code === getDynamoCode.code) {
            return util.buildResponse(200, {
                message: 'ok'
            })
        } else {
            return util.buildResponse(401, {
                message: 'Code does not match, please retype the code'
            })
        }
    }
}

async function getCode(email) {
    const params = {
        TableName: tableName,
        Key: {
            email: email
        }
    }
    return await dynamodb.get(params).promise().then(response => {
        return response.Item;
    }, error => {
        console.error('There is an error getting user', error);
    })
}

module.exports.compareCode = compareCode;