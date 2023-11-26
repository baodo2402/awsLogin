const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-2'
})
const util = require('../utils/util');
const bcrypt = require('bcryptjs');
const auth = require('../utils/auth');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'user-info-table';

async function changeInfo(userInfo) {
    const newName = userInfo.newName;
    const newUsername = userInfo.newUsername;
    const newPhoneNumber = userInfo.newPhoneNumber;
    const newPassword = userInfo.newPassword;
    //const username = userInfo.username;
    const email = userInfo.email;

    if(!newName || !newUsername || !newPhoneNumber || !newPassword) {
        return util.buildResponse(401, {
            message: 'All fields are required'
        })
    }

    try {
        //encrypt the password
        const newEncryptedPW = bcrypt.hashSync(newPassword.trim(), 10);
        const dynamoUser = await getUser(email);
        
        if (dynamoUser && dynamoUser.email) {
            await saveUser(newName, newUsername, newPhoneNumber, newEncryptedPW, dynamoUser.email);
            return util.buildResponse(200, {
                email: dynamoUser.email
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

async function getUser(email) {
    const params = {
        TableName: userTable,
        Key: {
            email: email
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

async function saveUser(newName, newUsername, newPhoneNumber, newPassword, email ) {
    const params = {
        TableName: userTable,
        Key: {
            email: email
        },
        UpdateExpression: 'SET #name = :name, #username = :username, #phoneNumber = :phoneNumber, #password = :password',
        ExpressionAttributeNames: {
            '#name': 'name',
            '#username': 'username',
            '#phoneNumber': 'phoneNumber',
            '#password': 'password'
        },
        ExpressionAttributeValues: {
            ':name': newName,
            ':username': newUsername,
            ':phoneNumber': newPhoneNumber,
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