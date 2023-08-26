const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-2'
})
const util = require('../utils/util');

const bcrypt = require('bcryptjs');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'jinmeister-users';




async function register(userInfo) {
    const name = userInfo.name;
    const email = userInfo.email;
    const username = userInfo.username;
    const password = userInfo.password;

        //check if any field is not filled yet
    if(!name || !email || !username || !password) {
        return util.buildResponse(401, {
            message: 'All fields are required'
        })
    }

    //check whether username is taken or not
    const dynamoUser = await getUser(username.toLowerCase().trim());
    if (dynamoUser && dynamoUser.username) {
        return util.buildResponse(401, {
            message: 'username already exists in our database, please choose a different username'
        })
    }

    //encrypt the password
    const encryptedPW = bcrypt.hashSync(password.trim(), 10);

    const user = {
        name: name,
        email: email,
        username: username.toLowerCase().trim(),
        password: encryptedPW
    }

    //save object to the database
    const saveUserResponse = await saveUser(user);
    if (!saveUserResponse) {
        return util.buildResponse(503, {message: 'Sever error. Please try again later'});
    }
    return util.buildResponse(200, {username: username});

    //define 2 methods: getUser and saveUser
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

    async function saveUser(user) {
        const params = {
            TableName: userTable,
            Item: user
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