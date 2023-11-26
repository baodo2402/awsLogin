const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-2'
})
const util = require('../utils/util');

const bcrypt = require('bcryptjs');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'user-info-table';


async function register(userInfo) {
    const name = userInfo.name;
    const email = userInfo.email;
    const username = userInfo.username;
    const phoneNumber = userInfo.phoneNumber;
    const password = userInfo.password;

        //check if any field is not filled yet
    if(!name || !email || !username || !phoneNumber || !password) {
        return util.buildResponse(401, {
            message: 'All fields are required'
        })
    }
    if(password.length <= 8) {
        return util.buildResponse(401, {
            message: 'Password must be longer than 8 characters'
        })
    }
    
    //check whether username is taken or not
    const dynamoUser = await getUser(email);
    if (dynamoUser && dynamoUser.email) {
        return util.buildResponse(401, {
            message: 'Email already exists'
        })
    }

    //encrypt the password
    const encryptedPW = bcrypt.hashSync(password.trim(), 10);

    const user = {
        email: email,
        name: name,
        username: username.toLowerCase().trim(),
        phoneNumber: phoneNumber,
        password: encryptedPW
    }

    //save object to the database
    const saveUserResponse = await saveUser(user);
    if (!saveUserResponse) {
        return util.buildResponse(503, {message: 'Sever error. Please try again later'});
    }
    return util.buildResponse(200, {email: email});

    //define 2 methods: getUser and saveUser
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

    async function saveUser(email) {
        const params = {
            TableName: userTable,
            Item: email
        }
        return await dynamodb.put(params).promise().then(() => {
            return true;
        }, error => {
            console.error('There is an error saving user: ', error)
        });
    }
}


//export the function
module.exports.register = register;