const AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-2'
})
const util = require('../utils/util');

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function setYearArray(userInfo) {
    const tableName = userInfo.tableName;
    const year = userInfo.year;
    const array = userInfo.array;

    if (!tableName || !year || !array) {
        return util.buildResponse(401, {
            message: 'tableName, array and year are required'
        })
    }

    const dynamoYear = await getYear(tableName, year);
    if (dynamoYear && dynamoYear.year) {
        return util.buildResponse(401, {
            message: 'Year already exists'
        })
    }


    const item = {
        year: year,
        array: array
    }

    //save object to the database
    const saveYearResponse = await saveYear(tableName, item);
    if (!saveYearResponse) {
        return util.buildResponse(503, {message: 'Sever error. Please try again later'});
    }
    return util.buildResponse(200, {year: year});
}

async function getYear(tableName, year) {
    const params = {
        TableName: tableName,
        Key: {
            year: year
        }
    }
    return await dynamodb.get(params).promise().then(response => {
        return response.Item;
    }, error => {
        console.error('There is an error getting year', error);
    })
}

async function saveYear(tableName, item) {
    const params = {
        TableName: tableName,
        Item: item
    }
    return await dynamodb.put(params).promise().then(() => {
        return true;
    }, error => {
        console.error('There is an error saving year: ', error)
    });
}
module.exports.setYearArray = setYearArray;