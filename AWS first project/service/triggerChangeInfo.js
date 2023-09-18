const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-2'
})
const util = require('../utils/util');
const bcrypt = require('bcryptjs');
const auth = require('../utils/auth');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'jinmeister-users';

async function triggerChangeInfo(userInfo) {
    const { password, token, username } = userInfo;
    if(!password && !token && !username) {
        return util.buildResponse(401, {
            message: 'missing or invalid data'
        });
    }
    
    //check whether user exist or not
    const dynamoUser = await getUser(username.toLowerCase().trim());
    if (!dynamoUser || !dynamoUser.username) {
        return util.buildResponse(403, { message: 'user does not exist'});
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

async function getUser(username) {
    const params = {
        TableName: userTable,
        Key: {
            username: username
        }
    }
    
    return await dynamodb.get(params).promise().then(response => {
        return response.Item;
    }, error => {
        console.error('There is an error getting user', error);
    })
}


module.exports.triggerChangeInfo = triggerChangeInfo;