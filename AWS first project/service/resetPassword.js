const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-2'
})
const util = require('../utils/util');
const bcrypt = require('bcryptjs');
const auth = require('../utils/auth');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'user-info-table';

async function resetPassword(userInfo) {
    const email = userInfo.email;
    const newPassword = userInfo.newPassword;

    if(!email || !newPassword) {
        return util.buildResponse(401, {
            message: 'All fields are required'
        })
    }

    try {
        //encrypt the password
        const newEncryptedPW = bcrypt.hashSync(newPassword.trim(), 10);
        const dynamoUser = await getUser(email);
        
        if (dynamoUser && dynamoUser.email) {
            await saveUser(newEncryptedPW, dynamoUser.email);
            return util.buildResponse(200, {
                message: "Password reset successfully, you can now login with your new password"
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

async function saveUser(newPassword, email ) {
    const params = {
        TableName: userTable,
        Key: {
            email: email
        },
        UpdateExpression: 'SET #password = :password',
        ExpressionAttributeNames: {
            '#password': 'password'
        },
        ExpressionAttributeValues: {
            ':password': newPassword
        }
    };
    
    try {
        await dynamodb.update(params).promise();
        console.log('Password updated successfully');
    } catch (error) {
        console.error('Error updating password', error);
        throw error;
    }
}

module.exports.resetPassword = resetPassword;