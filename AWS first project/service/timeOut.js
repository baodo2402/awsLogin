const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-2'
});
const util = require('../utils/util');
const dynamodb = new AWS.DynamoDB.DocumentClient();



async function timeOut(userInfo) {
    const { username, timeOut } = userInfo;

    if(!username && !timeOut) {
        return util.buildResponse(400, {
            message: 'Missing or invalid data'
        });
    }

    try {
        const dynamoUser = await getUser(username.toLowerCase().trim());
        const dynamoId = await getUuid(username.toLowerCase().trim())
        if(dynamoUser && dynamoUser.username) {
            await saveTimeOut(dynamoId, timeOut);
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
        TableName: 'jinmeister-users',
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

async function getUuid(username) {
    const params = {
        TableName: 'jinmeister-users',
        Key: {
            username: username
        }
    };

    try {
        const response = await dynamodb.get(params).promise();

        // Check if a matching item was found
        if (response.Item) {
            // Access the id from the response.Item
            const id = response.Item.id;
            return id;
        } else {
            // No matching item found
            return null;
        }
    } catch (error) {
        console.error('Error getting id:', error);
        throw error;
    }
}

async function saveTimeOut(uuid, timeOut) {
    const params = {
        TableName: 'shift-tracking',
        Key: {
            id: uuid
        },
        UpdateExpression: 'SET timeOut = :timeOut',
        ExpressionAttributeValues: {
            ':timeOut': timeOut
        }
    };
    try {
        await dynamodb.update(params).promise();
    } catch (error) {
        console.error('Error updating timeOut', error);
        throw error;
    }

}

module.exports.timeOut=timeOut;
// const AWS = require('aws-sdk');
// AWS.config.update({
//     region: 'ap-southeast-2'
// });
// const dynamodb = new AWS.DynamoDB.DocumentClient();
// const util = require('../utils/util');

// async function timeOut(userInfo) {
//     const { username, timeOut } = userInfo;

//     if (!username || !timeOut) {
//         return util.buildResponse(400, {
//             message: 'Missing or invalid data'
//         });
//     }

//     try {
//         const dateOutSplit = timeOut.split(",");
//         const dateOut = dateOutSplit[0].trim();
//         const dynamoDateIn = await getDateIn(dateOut);

//         // Check if dynamoDateIn is not null (matching dateIn found)
//         if (dynamoDateIn) {
//             // Query the 'shift-tracking' table based on 'username' and 'dateIn'
//             const queryParams = {
//                 TableName: 'shift-tracking',
//                 KeyConditionExpression: 'username = :username AND dateIn = :dateIn',
//                 ExpressionAttributeValues: {
//                     ':username': username,
//                     ':dateIn': dynamoDateIn.dateIn // Assuming the property name is 'dateIn'
//                 }
//             };

//             const queryResult = await dynamodb.query(queryParams).promise();

//             // Check if any matching items were found
//             if (queryResult.Count > 0) {
//                 // Update 'timeOut' attribute for each matching item
//                 const updatePromises = queryResult.Items.map(async (item) => {
//                     item.timeOut = timeOut;

//                     const updateParams = {
//                         TableName: 'shift-tracking',
//                         Key: { username: item.username, dateIn: item.dateIn },
//                         UpdateExpression: 'SET timeOut = :timeOut',
//                         ExpressionAttributeValues: { ':timeOut': timeOut }
//                     };

//                     await dynamodb.update(updateParams).promise();
//                 });

//                 await Promise.all(updatePromises);

//                 // Return success response
//                 return util.buildResponse(200, {
//                     message: 'timeOut updated'
//                 });
//             } else {
//                 // No matching items found
//                 return util.buildResponse(404, {
//                     message: 'No matching records found'
//                 });
//             }
//         } else {
//             // No matching dateIn found
//             return util.buildResponse(404, {
//                 message: 'No matching dateIn found'
//             });
//         }
//     } catch (error) {
//         console.error('Error updating timeOut', error);
//         return util.buildResponse(500, {
//             message: 'Internal server errorrrr' + error.message
//         });
//     }
// }

// async function getDateIn(date) {
//     try {
//         // Query the 'shift-tracking' table based on 'dateIn'
//         const queryParams = {
//             TableName: 'shift-tracking',
//             KeyConditionExpression: 'dateIn = :dateIn',
//             ExpressionAttributeValues: {
//                 ':dateIn': date
//             }
//         };

//         const queryResult = await dynamodb.query(queryParams).promise();

//         // Check if any matching items were found
//         if (queryResult.Count > 0) {
//             // Return the first matching dateIn
//             return queryResult.Items[0];
//         } else {
//             // No matching dateIn found
//             return null;
//         }
//     } catch (error) {
//         console.error('Error getting dateIn', error);
//         throw error;
//     }
// }

// module.exports.timeOut = timeOut;







// const AWS = require('aws-sdk');
// AWS.config.update({
//     region: 'ap-southeast-2'
// });
// const util = require('../utils/util');
// const dynamodb = new AWS.DynamoDB.DocumentClient();
// //const uuid = require('uuid');

// async function timeOut(userInfo) {
//     const { username, timeOut } = userInfo;

//     if(!username || !timeOut) {
//         return util.buildResponse(400, {
//             message: 'Missing or invalid data'
//         });
//     }

//     try {
//         const dateOutSplit = timeOut.split(",");
//         const dateOut = dateOutSplit[0].trim();
//         const dynamoDateIn = await getDateIn(dateOut);
//         const dynamoUser = await getUser(username.toLowerCase().trim());

//         if (dynamoUser && dynamoUser.username && dynamoDateIn && dynamoDateIn.dateIn) {
//             await saveTimeOut(dynamoUser.username, dateOut, timeOut);
//             return util.buildResponse(200, {
//                 username: dynamoUser.username
//             });
//         } else {
//             return util.buildResponse(404, {
//                 message: 'User not found'
//             });
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         return util.buildResponse(500, {
//             message: 'Internal server error'
//         });
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

// async function getDateIn(date) {
//     const params = {
//         TableName: 'shift-tracking',
//         Key: {
//             dateIn: date
//         }
//     };

//     try {
//         const response = await dynamodb.get(params).promise();
//         return response.Item;
//     } catch (error) {
//         console.error('Error getting time in:', error);
//         throw error;
//     }
// }

// async function saveTimeOut(username, dateIn, timeOut) {
//     //query
//     const queryParams = {
//         TableName: 'shift-tracking',
//         KeyConditionExpression: 'username = :username AND dateIn = :dateIn',
//         ExpressionAttributeValues: {
//             ':username': username,
//             ':dateIn': dateIn
//         }
//     };

//     try {
//         const queryResult = await dynamodb.query(queryParams).promise();
//         //update
//         for (const item of queryResult.Items) {
//             const updateParams = {
//                 TableName: 'shift-tracking',
//                 Key: {
//                     username: item.username,
//                     dateIn: item.dateIn
//                 },
//                 UpdateExpression: 'SET timeOut = :timeOut',
//                 ExpressionAttributeValues: {
//                     ':timeOut': timeOut
//                 }
//             };

//             await dynamodb.update(updateParams).promise();
//         }
//     } catch (error) {
//         console.error('Error updating timeOut', error);
//         throw error;
//     }
// }

// module.exports.timeOut = timeOut;