const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-2'
});
const util = require('../utils/util');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');
const tableName = 'user-info-table'

async function shift(userInfo) {
    const { email, timeIn } = userInfo;

    if (!email || !timeIn) {
        return util.buildResponse(400, {
            message: 'Missing or invalid data'
        });
    }
    
    try {
        const dateInSplit = timeIn.split(",");
        const dateIn = dateInSplit[0].trim();
        const dynamoUser = await getUser(email);
        const uniqueId = uuid.v4();
        if (dynamoUser && dynamoUser.email && dynamoUser.name) {
            await saveUser({
                email: dynamoUser.email,
                name: dynamoUser.name,
                timeIn,
                dateIn: dateIn,
                id: uniqueId
            });

            await saveUuid(dynamoUser.email, uniqueId);

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
        TableName: tableName,
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

async function saveUser(user) {
    const params = {
        TableName: 'shift-tracking',
        Item: user
    };

    try {
        await dynamodb.put(params).promise();
    } catch (error) {
        console.error('Error saving user:', error);
        throw error;
    }
}

async function saveUuid(email, uuid) {
    const params = {
        TableName: tableName,
        Key: {
            email: email
        },
        UpdateExpression: 'SET id = :id',
        ExpressionAttributeValues: {
            ':id': uuid
        }
    };

    try {
        await dynamodb.update(params).promise();
    } catch (error) {
        console.error('Error updating timeIn', error);
        throw error;
    }
}


module.exports.shift = shift;
// const AWS = require('aws-sdk');
// AWS.config.update({
//     region: 'ap-southeast-2'
// });
// const util = require('../utils/util');
// const dynamodb = new AWS.DynamoDB.DocumentClient();
// const uuid = require('uuid');

// async function shift(userInfo) {
//     const { username, action } = userInfo;

//     // if (!username || !action) {
//     //     return util.buildResponse(400, {
//     //         message: 'Missing or invalid data'
//     //     });
//     // }

//     try {
//         if (action === 'timeIn') {
//             if (!username) {
//                 return util.buildResponse(400, {
//                     message: 'Missing or invalid username'
//                 });
//             }
//             // Generate a new uniqueId for each timeIn request
//             const id = uuid.v4();

//             await saveUser({
//                 username: username.toLowerCase().trim(),
//                 timeIn: new Date().toISOString(), // Store the current timestamp as timeIn
//                 id
//             });

//             return util.buildResponse(200, {
//                 username,
//                 message: 'TimeIn recorded'
//             });
//         } else if (action === 'timeOut') {
//             if (!username) {
//                 return util.buildResponse(400, {
//                     message: 'Missing or invalid username'
//                 });
//             }
//             // Find the previous record for the user with the same UUID
//             const previousRecord = await getShiftByUsernameAndId(username.toLowerCase().trim(), userInfo.id);

//             if (!previousRecord) {
//                 return util.buildResponse(404, {
//                     message: 'No matching timeIn record found'
//                 });
//             }

//             // Update the existing record with timeOut
//             await updateShiftTimeOut(username.toLowerCase().trim(), userInfo.id, new Date().toISOString());

//             return util.buildResponse(200, {
//                 username,
//                 message: 'TimeOut recorded'
//             });
//         } else {
//             return util.buildResponse(400, {
//                 message: 'Invalid action'
//             });
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         return util.buildResponse(500, {
//             message: 'Internal server error'
//         });
//     }
// }

// async function getShiftByUsernameAndId(username, id) {
//     const params = {
//         TableName: 'shift-tracking',
//         Key: {
//             username,
//             id
//         }
//     };

//     try {
//         const response = await dynamodb.get(params).promise();
//         return response.Item;
//     } catch (error) {
//         console.error('Error getting shift:', error);
//         throw error;
//     }
// }

// async function updateShiftTimeOut(username, id, timeOut) {
//     const params = {
//         TableName: 'shift-tracking',
//         Key: {
//             username,
//             id
//         },
//         UpdateExpression: 'SET #to = :to',
//         ExpressionAttributeNames: {
//             '#to': 'timeOut'
//         },
//         ExpressionAttributeValues: {
//             ':to': timeOut
//         }
//     };

//     try {
//         await dynamodb.update(params).promise();
//     } catch (error) {
//         console.error('Error updating shift:', error);
//         throw error;
//     }
// }

// // The rest of your functions remain unchanged
// async function saveUser(user) {
//     const params = {
//         TableName: 'shift-tracking',
//         Item: user
//     };

//     try {
//         await dynamodb.put(params).promise();
//     } catch (error) {
//         console.error('Error saving user:', error);
//         throw error;
//     }
// }
// async function getUser(username) {
//     const params = {
//         TableName: 'jinmeister-users',
//         Key: {
//             username: username
//         }
//     };

//     try {
//         const response = await dynamodb.get(params).promise();
//         return response.Item;
//     } catch (error) {
//         console.error('Error getting user:', error);
//         throw error;
//     }
// }

// module.exports.shift = shift;
