const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-2'
})
const util = require('../utils/util');
const bcrypt = require('bcryptjs');
const auth = require('../utils/auth');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'jinmeister-users';

async function changeInfo(userInfo) {
    const newName = userInfo.newName;
    const newEmail = userInfo.newEmail;
    //const newUsername = userInfo.newUsername;
    const newPassword = userInfo.newPassword;
    const username = userInfo.username;

    if(!newName || !newEmail || !username || !newPassword) {
        return util.buildResponse(401, {
            message: 'All fields are required'
        })
    }

    try {
        //encrypt the password
        const newEncryptedPW = bcrypt.hashSync(newPassword.trim(), 10);
        const dynamoUser = await getUser(username.toLowerCase().trim());
        
        if (dynamoUser && dynamoUser.username) {
            await saveUser(newName, newEmail, newEncryptedPW, dynamoUser.username);
            return util.buildResponse(200, {
                username: dynamoUser.username
            });
        } else {
            return util.buildResponse(404, {
                message: 'User not found'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        return util.buildResponse(500, {
            message: 'Internal server error' + error.message
        });
    }


}

async function getUser(username) {
    const params = {
        TableName: userTable,
        Key: {
            username: username
        }
    };

    try {
        const response = await dynamodb.get(params).promise();
        return response.Item;
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
}

async function saveUser(newName, newEmail, newPassword, username ) {
    const params = {
        TableName: userTable,
        Key: {
            username: username
        },
        UpdateExpression: 'SET #name = :name, #email = :email, #password = :password',
        ExpressionAttributeNames: {
            '#name': 'name',
            '#email': 'email',
            //'#username': 'username',
            '#password': 'password'
        },
        ExpressionAttributeValues: {
            ':name': newName,
            ':email': newEmail,
            //':username': newUsername,
            ':password': newPassword
        }
    };
    
    try {
        await dynamodb.update(params).promise();
        console.log('info updated successfully');
    } catch (error) {
        console.error('Error updating information', error);
        throw error;
    }
}

module.exports.changeInfo = changeInfo;