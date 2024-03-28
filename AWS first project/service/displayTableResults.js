const AWS = require('aws-sdk');
const util = require('../utils/util');

AWS.config.update({
    region: 'ap-southeast-2'
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function displayTableResult(userInfo) {
    const tableName = userInfo.tableName;
    const filters = userInfo.filters;

    // Validate tableName
    if (!tableName) {
        return util.buildResponse(400, {
            message: "TableName is required."
        });
    }


    if (!filters) {
        const params = {
            TableName: tableName
        };
        
        try {
            const data = await dynamodb.scan(params).promise();
            console.log("OK", data.Items);
            
            return util.buildResponse(200, {
                items: data.Items
            });
        } catch (error) {
            console.error("Error:", error);
            return util.buildResponse(401, {
                message: "Error: " + error.message
            });
        }        

    } else {
        // Build FilterExpression and ExpressionAttributeValues dynamically
        const filterExpressions = [];
        const expressionAttributeValues = {};

        Object.keys(filters).forEach((attribute, index) => {
            const placeholder = `:value${index}`;

            if (attribute === 'startTime' && !filters.endTime) {
                // If only startTime is provided, and endTime is not provided
                filterExpressions.push(`#date >= :startTime`);
                expressionAttributeValues[':startTime'] = filters.startTime;
            } else if (attribute === 'endTime' && !filters.startTime) {
                // If only endTime is provided, and startTime is not provided
                filterExpressions.push(`#date <= :endTime`);
                expressionAttributeValues[':endTime'] = filters.endTime;
            } else {
                // For other attributes
                if (attribute === 'startTime' || attribute === 'endTime') {
                    filterExpressions.push(`#date BETWEEN :startTime AND :endTime`);
                    expressionAttributeValues[':startTime'] = filters.startTime;
                    expressionAttributeValues[':endTime'] = filters.endTime;
                } else {
                    filterExpressions.push(`contains(#${attribute}, ${placeholder})`);
                    expressionAttributeValues[placeholder] = filters[attribute];
                }
            }

        });

        const filterExpression = filterExpressions.join(' AND ');
        const expressionAttributeNames = Object.keys(filters).reduce((acc, attribute) => {
            if (attribute === 'startTime' || attribute === 'endTime') {
                acc['#date'] = 'date';
            } else {
                acc[`#${attribute}`] = attribute;
            }
            return acc;
        }, {});

        const params = {
            TableName: tableName,
            FilterExpression: filterExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
        };

        const scanResults = [];

        try {
            do {
                const items = await dynamodb.scan(params).promise();

                // Process items
                if (items.Items && items.Items.length > 0) {
                    items.Items.forEach((item) => scanResults.push(item));
                }

                // Set ExclusiveStartKey for paginated results
                params.ExclusiveStartKey = items.LastEvaluatedKey;

            } while (typeof params.ExclusiveStartKey !== "undefined");

            return util.buildResponse(200, scanResults);
        } catch (error) {
            console.error("Error scanning DynamoDB table:", error);

            return util.buildResponse(500, {
                message: "Internal Server Error " + error.message
            });
        }
    }
}

module.exports.displayTableResult = displayTableResult;
