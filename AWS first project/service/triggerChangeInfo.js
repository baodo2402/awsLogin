const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-2'
})
const util = require('../utils/util');
const bcrypt = require('bcryptjs');
const auth = require('../utils/auth');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'user-info-table';

async function triggerChangeInfo(userInfo) {
    const { password, token, email } = userInfo;
    if(!password && !token && !email) {
        return util.buildResponse(401, {
            message: 'Missing or invalid data'
        });
    }
    
    //check whether user exist or not
    const dynamoUser = await getUser(email);
    if (!dynamoUser || !dynamoUser.email) {
        return util.buildResponse(403, { message: 'Email does not exist'});
    }

    //check password match
    if (!bcrypt.compareSync(password, dynamoUser.password)) {
        return util.buildResponse(403, { message: 'password is incorrect'});
    }

    

    //return if password match and token is valid
    return util.buildResponse(200,{
        message: 'trigger successful'
    });

}

async function getUser(email) {
    const params = {
        TableName: userTable,
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


module.exports.triggerChangeInfo = triggerChangeInfo;