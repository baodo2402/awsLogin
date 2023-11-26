const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-2'
})
const util = require('../utils/util');
const bcrypt = require('bcryptjs');
const auth = require('../utils/auth');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'user-info-table';


async function login(user) {
    const email = user.email;
    const password = user.password;

    if (!user || !email || !password) {
        return util.buildResponse(401, {
            message: 'Email and password are required'
        })
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



    const userInfo = {
        email: dynamoUser.email,
        username: dynamoUser.username,
        name: dynamoUser.name,
        phoneNumber: dynamoUser.phoneNumber
    }

    const token = auth.generateToken(userInfo);
    //define response body
    const response = {
        user: userInfo,
        token: token
    }
    return util.buildResponse(200, response);

}




//get user (same in register)
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


module.exports.login = login;
